using App.Common.Attributes;
using App.Common.Constants;
using App.Common.Helpers;
using App.Common.Interfaces;
using App.Common.Models;
using App.Core.Extensions;
using App.Core.Interfaces.Communication;
using App.Core.Models.Common;
using App.Core.Models.Communication;
using Dapper;
using OpenTokSDK;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services.Communication
{
    [TransientService]
    public class OpenTokService : IOpenTokService
    {
        private readonly ICryptoManager _cryptoManager;
        private readonly IDapperContext _dapperContext;
        private readonly ICurrentUserService _currentUserService;
        private readonly ITokenManager _tokenManagerService;
        private readonly IChatRoomMessageService _chatRoomMessageService;
        private readonly IChatHubService _chatHubService;
        private readonly IChatConnectedUserService _chatConnectedUserService;
        private readonly OpenTokOptionsDto _openTokOptions;

        public OpenTokService
        (
             ICryptoManager cryptoManager,
             IDapperContext dapperContext,
             ICurrentUserService currentUserService,
             ITokenManager tokenManagerService,
             IChatRoomMessageService chatRoomMessageService,
             IChatHubService chatHubService,
             IChatConnectedUserService chatConnectedUserService,
             OpenTokOptionsDto openTokOptions
        )
        {
            _cryptoManager = cryptoManager;
            _dapperContext = dapperContext;
            _currentUserService = currentUserService;
            _tokenManagerService = tokenManagerService;
            _chatRoomMessageService = chatRoomMessageService;
            _chatHubService = chatHubService;
            _chatConnectedUserService = chatConnectedUserService;
            _openTokOptions = openTokOptions;
        }

        public OpenTokOptionsDto GetOpenTokOptions(int organizationId)
        {
            return _openTokOptions;
        }

        public OpenTok GetOpenTokObject(int organizationId, OpenTokOptionsDto options = default)
        {
            var obj = options ?? GetOpenTokOptions(organizationId);

            int.TryParse(obj.APIKey, out int apiKey);

            return new OpenTok(apiKey, obj.APISecret);
        }

        public async Task<AppResponse<OpenTokSessionDto>> GetOpenTokSessionByInvitationId(string invitationId)
        {
            if (string.IsNullOrWhiteSpace(invitationId))
                return AppResponse.Fail(default(OpenTokSessionDto), CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            var decryptedInvId = _cryptoManager.DecryptText(invitationId.Replace(" ", "+"));
            var invitTokens = decryptedInvId.Split('|', StringSplitOptions.RemoveEmptyEntries);
            var invitId = invitTokens[0];
            var orgId = invitTokens.Length > 1 ? invitTokens[1] : "0";

            Guid.TryParse(invitId, out Guid invId);
            int.TryParse(orgId, out int organizationId);

            using var connection = _dapperContext
                .CreateOrganizationConnectionByOrganizationId(organizationId);

            var result = await GetSessionDetailsByInvitationIdAndOrganization(connection, invId, organizationId);

            if (result == null)
                return AppResponse.Fail(result, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            var portalUser = await GetUserDetails(connection, result.UserId);

            if (portalUser == null)
                return AppResponse.Fail(result, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            var claims = portalUser.GetClaims(PortalOptions.WaitingRoom.ToString());
            result.AccessToken = _tokenManagerService.GenerateTokenFromClaims(claims);

            var options = GetOpenTokOptions(organizationId);

            result.ApiKey = options.APIKey;

            var isRemoved = await RemoveTokenIfExpired
            (
                result.SessionTokenId,
                result.TokenExpiry,
                connection,
                result.UserId,
                _currentUserService.IpAddress
            );

            if (!isRemoved && !string.IsNullOrWhiteSpace(result.Token))
                return AppResponse.Success(result, CommonMessageTemplates.Found, HttpStatusCodes.OK);

            var duration = GetDuration();
            var openTok = GetOpenTokObject(organizationId, options);
            var token = openTok.GenerateToken(result.SessionId, Role.PUBLISHER, duration);

            result.Token = token;

            var model = new GroupSessionTokensDto
            {
                SessionTokenId = 0,
                SessionId = result.Id,
                SessionInvitationId = result.SessionInvitationId,
                TokenKey = token,
                TokenExpiry = duration,
                OrganizationId = organizationId,
            };

            var tokenResult = await AddGroupSessionTokens(connection, model, result.UserId, _currentUserService.IpAddress);

            if (!tokenResult.IsSuccess)
                return AppResponse.Fail(result, tokenResult.Message, HttpStatusCodesHelper.GetHttpStatusCode(tokenResult.StatusCode, HttpStatusCodes.InternalServerError));

            return AppResponse.Success(result, CommonMessageTemplates.Found, HttpStatusCodes.OK);
        }

        public async Task<AppResponse<OpenTokSessionDto>> GetOpenTokSessionByAppointmentId(int appointmentId)
        {
            var notFoundResponse = AppResponse.Fail(default(OpenTokSessionDto), CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            if (appointmentId <= 0)
                return notFoundResponse;

            var currentUserId = _currentUserService.UserId;
            var organizationId = _currentUserService.OrganizationId;
            var ipAddress = _currentUserService.IpAddress;

            using var connection = _dapperContext.CreateOrganizationConnection();

            _ = await CreateMissingClientUserForAppointment(connection, appointmentId, organizationId, currentUserId, ipAddress);

            var obj = await GetAppointmentAndSessionDetails(connection, appointmentId, organizationId);

            var clientAppointmentDto = obj.ClientAppointments;

            if (clientAppointmentDto == null)
                return notFoundResponse;

            var options = GetOpenTokOptions(organizationId);
            var openTok = GetOpenTokObject(organizationId, options);

            var groupSessionDto = obj.GroupSessions;

            if (groupSessionDto == null)
            {
                var openTokSession = await openTok.CreateSessionAsync(string.Empty, MediaMode.ROUTED);
                var sessionKey = openTokSession.Id;

                groupSessionDto = new GroupSessionsDto
                {
                    SessionId = 0,
                    SessionKey = sessionKey,
                    OrganizationId = organizationId,
                };

                var groupSessionResult = await AddGroupSessions(connection, groupSessionDto, currentUserId, ipAddress);

                if (!groupSessionResult.IsSuccess)
                    return notFoundResponse;
            }

            var clientId = clientAppointmentDto.ClientId;
            var clientUserId = clientAppointmentDto.ClientUserId;
            var appointmentUserId = clientAppointmentDto.AppointmentUserId;
            var clientGroupSessionInvitationDto = obj.GroupSessionInvitations.FirstOrDefault(x => x.ClientId == clientId);
            var providerGroupSessionInvitationDto = obj.GroupSessionInvitations.FirstOrDefault(x => x.UserId == appointmentUserId);

            if (clientGroupSessionInvitationDto == null)
            {
                clientGroupSessionInvitationDto = new GroupSessionInvitationsDto
                {
                    SessionInvitationId = 0,
                    SessionId = groupSessionDto.SessionId,
                    AppointmentId = appointmentId,
                    UserId = clientUserId,
                    InvitaionId = Guid.NewGuid(),
                    OrganizationId = organizationId,
                    ClientId = clientId,
                };

                var clientInvitationResponse = await AddGroupSessionInvitations(connection, clientGroupSessionInvitationDto, currentUserId, ipAddress);

                if (!clientInvitationResponse.IsSuccess)
                    return notFoundResponse;
            }

            if (providerGroupSessionInvitationDto == null)
            {
                providerGroupSessionInvitationDto = new GroupSessionInvitationsDto
                {
                    SessionInvitationId = 0,
                    SessionId = groupSessionDto.SessionId,
                    AppointmentId = appointmentId,
                    UserId = appointmentUserId,
                    InvitaionId = Guid.NewGuid(),
                    OrganizationId = organizationId,
                };

                var providerInvitationResponse = await AddGroupSessionInvitations(connection, providerGroupSessionInvitationDto, currentUserId, ipAddress);

                if (!providerInvitationResponse.IsSuccess)
                    return notFoundResponse;
            }

            var clientGroupSessionTokenDto = obj.GroupSessionTokens.FirstOrDefault
            (
                x => x.SessionId == groupSessionDto.SessionId
                    && x.SessionInvitationId == clientGroupSessionInvitationDto.SessionInvitationId
            );

            var providerGroupSessionTokenDto = obj.GroupSessionTokens.FirstOrDefault
            (
                x => x.SessionId == groupSessionDto.SessionId
                    && x.SessionInvitationId == providerGroupSessionInvitationDto.SessionInvitationId
            );

            if (clientGroupSessionTokenDto != null)
            {
                var isRemoved = await RemoveTokenIfExpired
                (
                    clientGroupSessionTokenDto.SessionTokenId,
                    clientGroupSessionTokenDto.TokenExpiry,
                    connection,
                    currentUserId,
                    ipAddress
                );

                if (isRemoved)
                    clientGroupSessionTokenDto = null;
            }

            if (clientGroupSessionTokenDto == null)
            {
                var duration = GetDuration();
                var tokenKey = openTok.GenerateToken(groupSessionDto.SessionKey, Role.PUBLISHER, duration);

                clientGroupSessionTokenDto = new GroupSessionTokensDto
                {
                    SessionTokenId = 0,
                    SessionId = groupSessionDto.SessionId,
                    SessionInvitationId = clientGroupSessionInvitationDto.SessionInvitationId,
                    TokenKey = tokenKey,
                    TokenExpiry = duration,
                    OrganizationId = organizationId,
                };

                var clientTokenResponse = await AddGroupSessionTokens(connection, clientGroupSessionTokenDto, currentUserId, ipAddress);

                if (!clientTokenResponse.IsSuccess)
                    return notFoundResponse;
            }

            if (providerGroupSessionTokenDto != null)
            {
                var isRemoved = await RemoveTokenIfExpired
                (
                    providerGroupSessionTokenDto.SessionTokenId,
                    providerGroupSessionTokenDto.TokenExpiry,
                    connection,
                    currentUserId,
                    ipAddress
                );

                if (isRemoved)
                    providerGroupSessionTokenDto = null;
            }

            if (providerGroupSessionTokenDto == null)
            {
                var duration = GetDuration();
                var tokenKey = openTok.GenerateToken(groupSessionDto.SessionKey, Role.PUBLISHER, duration);

                providerGroupSessionTokenDto = new GroupSessionTokensDto
                {
                    SessionTokenId = 0,
                    SessionId = groupSessionDto.SessionId,
                    SessionInvitationId = providerGroupSessionInvitationDto.SessionInvitationId,
                    TokenKey = tokenKey,
                    TokenExpiry = duration,
                    OrganizationId = organizationId,
                };

                var providerTokenResponse = await AddGroupSessionTokens(connection, providerGroupSessionTokenDto, currentUserId, ipAddress);

                if (!providerTokenResponse.IsSuccess)
                    return notFoundResponse;
            }

            var openTokSessionDto = new OpenTokSessionDto
            {
                ApiKey = options.APIKey,
                ApiSecret = options.APISecret,
                SessionId = groupSessionDto.SessionKey,
                Token = appointmentUserId == currentUserId
                    ? providerGroupSessionTokenDto.TokenKey
                    : clientGroupSessionTokenDto.TokenKey,
                Id = groupSessionDto.SessionId,
                AppointmentId = appointmentId,
                UserId = currentUserId,
                Name = _currentUserService.UserEmail,
                Email = _currentUserService.UserEmail,
            };

            return AppResponse.Success(openTokSessionDto, CommonMessageTemplates.Found, HttpStatusCodes.OK);
        }

        public async Task<AppResponse<Archive>> StartVideoRecording(string sessionId)
        {
            var options = GetOpenTokOptions(_currentUserService.OrganizationId);
            var openTok = GetOpenTokObject(_currentUserService.OrganizationId, options);

            var archive = await openTok.StartArchiveAsync(sessionId, "Appointment Recording");

            if (archive == null)
                return AppResponse.Fail(archive, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            var recordingDto = new GroupSessionRecordingsDto
            {
                SessionRecordingId = 0,
                SessionId = 0,
                ArchiveId = archive.Id.ToString(),
                SessionKey = sessionId,
                AppointmentId = 0,
                OrganizationId = _currentUserService.OrganizationId,
            };

            using var connection = _dapperContext.CreateOrganizationConnection();
            var videoSavedResult = await AddGroupSessionRecordings(connection, recordingDto, _currentUserService.UserId, _currentUserService.IpAddress);

            if (!videoSavedResult.IsSuccess)
                return AppResponse.Fail(default(Archive), videoSavedResult.Message, HttpStatusCodesHelper.GetHttpStatusCode(videoSavedResult.StatusCode, HttpStatusCodes.InternalServerError));

            return AppResponse.Success(archive, CommonMessageTemplates.UpdatedSuccessfully, HttpStatusCodes.OK);
        }

        public async Task<AppResponse<ChatFileDto>> StopVideoRecording(string archiveId, int appointmentId)
        {
            var options = GetOpenTokOptions(_currentUserService.OrganizationId);
            var openTok = GetOpenTokObject(_currentUserService.OrganizationId, options);

            Archive archive = await openTok.StopArchiveAsync(archiveId);

            if (archive == null)
                return AppResponse.Fail(default(ChatFileDto), CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            var recordingDto = new GroupSessionRecordingsDto
            {
                SessionRecordingId = 0,
                SessionId = 0,
                ArchiveId = archiveId,
                SessionKey = string.Empty,
                AppointmentId = appointmentId,
                OrganizationId = _currentUserService.OrganizationId,
            };

            using var connection = _dapperContext.CreateOrganizationConnection();
            var videoSavedResult = await AddGroupSessionRecordings(connection, recordingDto, _currentUserService.UserId, _currentUserService.IpAddress);

            if (!videoSavedResult.IsSuccess)
                return AppResponse.Fail(default(ChatFileDto), videoSavedResult.Message, HttpStatusCodesHelper.GetHttpStatusCode(videoSavedResult.StatusCode, HttpStatusCodes.InternalServerError));

            var model = GetChatRoomMessage(archiveId, appointmentId);
            var chatResponse = await _chatRoomMessageService.AddChatRoomMessage(model);

            if (!chatResponse.IsSuccess)
                return AppResponse.Fail(default(ChatFileDto), chatResponse.Message, HttpStatusCodesHelper.GetHttpStatusCode(chatResponse.StatusCode, HttpStatusCodes.InternalServerError));

            var obj = new ChatFileDto
            {
                FileName = "Call Recording",
                Message = archiveId,
                FileType = ".rec",
                MessageType = 1,
                IsFile = false,
                IsRecording = true,
            };

            return AppResponse.Success(obj, CommonMessageTemplates.UpdatedSuccessfully, HttpStatusCodes.OK);
        }

        public async Task<AppResponse<Archive>> GetVideoRecording(string archiveId)
        {
            var options = GetOpenTokOptions(_currentUserService.OrganizationId);
            var openTok = GetOpenTokObject(_currentUserService.OrganizationId, options);

            Archive archive = await openTok.GetArchiveAsync(archiveId);

            if (archive == null)
                return AppResponse.Fail(archive, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            return AppResponse.Success(archive, CommonMessageTemplates.Found, HttpStatusCodes.OK);
        }

        public async Task<AppResponse> CallInitiate(int appointmentId, int userId)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();
            var list = await _chatConnectedUserService.GetConnectedUsersForAppointment(connection, appointmentId, _currentUserService.OrganizationId, userId);

            await _chatHubService.NotifyCallInitiated(appointmentId, userId, list);

            return AppResponse.Response(true, CommonMessageTemplates.UpdatedSuccessfully, HttpStatusCodes.OK);
        }

        public async Task<AppResponse> CallEnd(int appointmentId, int userId)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();
            var list = await _chatConnectedUserService.GetConnectedUsersForAppointment(connection, appointmentId, _currentUserService.OrganizationId, userId);

            await _chatHubService.NotifyCallEnd(appointmentId, userId, list);

            return AppResponse.Response(true, CommonMessageTemplates.UpdatedSuccessfully, HttpStatusCodes.OK);
        }

        public async Task<AppResponse> HandleIncomingCall(string userConnectionId)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();
            var connectionIds = await _chatConnectedUserService.GetAllActiveUserConnections(_currentUserService.UserId);
            connectionIds = connectionIds.Where(x => !string.Equals(x, userConnectionId)).ToList();

            await _chatHubService.NotifyIncomingCallHandled(connectionIds, userConnectionId);

            return AppResponse.Response(true, CommonMessageTemplates.UpdatedSuccessfully, HttpStatusCodes.OK);
        }

        public async Task<AppResponse<List<UserForInvitationDto>>> GetUsersForInvitition(UserInvitationRequestDto model)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();

            var dbParams = new
            {
                OrganizationId = _currentUserService.OrganizationId,
                AppointmentId = model.AppointmentId,
                SearchTerm = model.SearchTerm,
            };

            var result = (await connection.QueryAsync<UserForInvitationDto>
            (
                DapperConstants.usp_cmsGetUsersForInvitation,
                dbParams,
                commandType: CommandType.StoredProcedure
            )).AsList();

            return AppResponse.Success(result);
        }

        public async Task<AppResponse> SendInvitation(InvitatedUserRequestDto model)
        {
            var notFoundResponse = AppResponse.Response(false, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);
            var appointmentId = model.AppointmentId;

            if (appointmentId <= 0)
                return notFoundResponse;

            var currentUserId = _currentUserService.UserId;
            var organizationId = _currentUserService.OrganizationId;
            var ipAddress = _currentUserService.IpAddress;

            using var connection = _dapperContext.CreateOrganizationConnection();

            var obj = await GetAppointmentAndSessionDetails(connection, appointmentId, organizationId);

            var clientAppointmentDto = obj.ClientAppointments;

            if (clientAppointmentDto == null)
                return notFoundResponse;

            var options = GetOpenTokOptions(organizationId);
            var openTok = GetOpenTokObject(organizationId, options);

            var groupSessionDto = obj.GroupSessions;

            if (groupSessionDto == null)
                return notFoundResponse;

            foreach (var userForInvitation in model.UserForInvitations)
            {
                // Only internal users allowed
                if (userForInvitation.UserId <= 0)
                    continue;

                var response = await CreateGroupSessionInvitationForUser
                (
                    connection,
                    userForInvitation.UserId,
                    appointmentId,
                    organizationId,
                    currentUserId,
                    ipAddress,
                    obj,
                    openTok
                );

                if (!response.IsSuccess)
                    return notFoundResponse;

                var invitationId = response.Data;
                var invitationToken = Uri.EscapeDataString(_cryptoManager.EncryptText($"{invitationId}|{organizationId}"));
                var initationUrl = $"{_currentUserService.Origin}/waiting-room/join/{invitationToken}";

                await SendInvitationEmailAsync
                (
                    //_emailService,
                    //_emailTemplateProvider,
                    userForInvitation,
                    clientAppointmentDto,
                    initationUrl
                );
            }

            var result = AppResponse.Response(true, "Invitation sent successfully.", HttpStatusCodes.OK);
            return await Task.FromResult(result);
        }

        private ChatRoomMessageDto GetChatRoomMessage(string archiveId, int appointmentId)
        {
            return new ChatRoomMessageDto
            {
                MessageId = 0,
                RoomId = 0,
                FromUserId = _currentUserService.UserId,
                RoomMessage = archiveId,
                OrganizationId = _currentUserService.OrganizationId,
                IsMessage = false,
                IsRecording = true,
                IsFile = false,
                FileName = archiveId,
                FileType = ".rec",
                MessageDate = DateTime.UtcNow,
                AppointmentId = appointmentId,
            };
        }

        private static async Task<AppResponse<string>> CreateGroupSessionInvitationForUser
        (
            IDbConnection connection,
            int userId,
            int appointmentId,
            int organizationId,
            int currentUserId,
            string ipAddress,
            AppointmentAndSessionDetailsDto obj,
            OpenTok openTok
        )
        {
            var groupSessionDto = obj.GroupSessions;
            var groupSessionInvitationDto = obj.GroupSessionInvitations
                .FirstOrDefault(x => x.UserId == userId);

            var invitaionId = string.Empty;

            if (groupSessionInvitationDto == null)
            {
                groupSessionInvitationDto = new GroupSessionInvitationsDto
                {
                    SessionInvitationId = 0,
                    SessionId = groupSessionDto.SessionId,
                    AppointmentId = appointmentId,
                    UserId = userId,
                    InvitaionId = Guid.NewGuid(),
                    OrganizationId = organizationId,
                };

                var invitationResponse = await AddGroupSessionInvitations(connection, groupSessionInvitationDto, currentUserId, ipAddress);

                if (!invitationResponse.IsSuccess
                    || groupSessionInvitationDto.InvitaionId == null)
                    return AppResponse.Fail(string.Empty, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

                invitaionId = groupSessionInvitationDto.InvitaionId.ToString();
            }

            var groupSessionTokenDto = obj.GroupSessionTokens.FirstOrDefault
            (
                x => x.SessionId == groupSessionDto.SessionId
                    && x.SessionInvitationId == groupSessionInvitationDto.SessionInvitationId
            );

            if (groupSessionTokenDto == null)
            {
                var duration = GetDuration();
                var tokenKey = openTok.GenerateToken(groupSessionDto.SessionKey, Role.PUBLISHER, duration);

                groupSessionTokenDto = new GroupSessionTokensDto
                {
                    SessionTokenId = 0,
                    SessionId = groupSessionDto.SessionId,
                    SessionInvitationId = groupSessionInvitationDto.SessionInvitationId,
                    TokenKey = tokenKey,
                    TokenExpiry = duration,
                    OrganizationId = organizationId,
                };

                var tokenResponse = await AddGroupSessionTokens(connection, groupSessionTokenDto, currentUserId, ipAddress);

                if (!tokenResponse.IsSuccess)
                    return AppResponse.Fail(string.Empty, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);
            }

            return AppResponse.Success(invitaionId, CommonMessageTemplates.UpdatedSuccessfully, HttpStatusCodes.OK);
        }

        private static async Task<AppResponse<int>> CreateMissingClientUserForAppointment(IDbConnection connection, int appointmentId, int organizationId, int userId, string ipAddress)
        {
            var dbParams = new
            {
                AppointmentId = appointmentId,
                OrganizationId = organizationId,
                LoggedInUserId = userId,
                IpAddress = ipAddress,
            };

            var result = await connection.QueryFirstOrDefaultAsync<AppResponse<int>>
            (
                DapperConstants.usp_cmsCreateMissingClientUserForAppointment,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            return result;
        }

        private static async Task<AppResponse<GroupSessionsDto>> AddGroupSessions(IDbConnection connection, GroupSessionsDto model, int userId, string ipAddress)
        {
            var dbParams = new
            {
                SessionId = model.SessionId,
                SessionKey = model.SessionKey,
                StartTime = model.StartTime,
                EndTime = model.EndTime,
                OrganizationId = model.OrganizationId,
                UserId = userId,
                IpAddress = ipAddress,
                Action = "A"
            };

            var result = await connection.QueryFirstOrDefaultAsync<AppResponse<int>>
            (
                DapperConstants.usp_cmsSaveGroupSessions,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Fail(model, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            if (!result.IsSuccess)
                return AppResponse.Fail(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.InternalServerError));

            model.SessionId = result.Data;

            return AppResponse.Success(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.OK));
        }

        private static async Task<AppResponse<GroupSessionInvitationsDto>> AddGroupSessionInvitations(IDbConnection connection, GroupSessionInvitationsDto model, int userId, string ipAddress)
        {
            var dbParams = new
            {
                SessionInvitationId = model.SessionInvitationId,
                SessionId = model.SessionId,
                AppointmentId = model.AppointmentId,
                UserId = model.UserId,
                InvitaionId = model.InvitaionId,
                OrganizationId = model.OrganizationId,
                ClientId = model.ClientId,
                LoginUserId = userId,
                IpAddress = ipAddress,
                Action = "A"
            };

            var result = await connection.QueryFirstOrDefaultAsync<AppResponse<int>>
            (
                DapperConstants.usp_cmsSaveGroupSessionInvitations,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Fail(model, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            if (!result.IsSuccess)
                return AppResponse.Fail(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.InternalServerError));

            model.SessionInvitationId = result.Data;

            return AppResponse.Success(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.OK));
        }

        private static async Task<OpenTokSessionDto> GetSessionDetailsByInvitationIdAndOrganization(IDbConnection connection, Guid invId, int organizationId)
        {
            var dbParams = new
            {
                invitaionId = invId,
                organizationId = organizationId
            };

            var result = await connection.QueryFirstOrDefaultAsync<OpenTokSessionDto>
            (
                DapperConstants.usp_cmsGetSessionDetailsByInvitationId,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            return result;
        }

        private static async Task<AppointmentAndSessionDetailsDto> GetAppointmentAndSessionDetails(IDbConnection connection, int appointmentId, int organizationId)
        {
            var dbParams = new
            {
                AppointmentId = appointmentId,
                OrganizationId = organizationId
            };

            var result = await connection.QueryMultipleAsync
            (
                DapperConstants.usp_cmsGetAppointmentAndSessionDetails,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            var obj = new AppointmentAndSessionDetailsDto();

            obj.ClientAppointments = await result.ReadFirstOrDefaultAsync<ClientAppointmentsDto>();
            obj.GroupSessions = await result.ReadFirstOrDefaultAsync<GroupSessionsDto>();
            obj.GroupSessionInvitations = (await result.ReadAsync<GroupSessionInvitationsDto>()).AsList();
            obj.GroupSessionTokens = (await result.ReadAsync<GroupSessionTokensDto>()).AsList();

            return obj;
        }

        private static async Task<AppResponse> DeleteGroupSessionTokens(IDbConnection connection, int sessionTokenId, int userId, string ipAddress)
        {
            var dbParams = new
            {
                SessionTokenId = sessionTokenId,
                UserId = userId,
                IpAddress = ipAddress,
                Action = "D"
            };

            var result = await connection.QueryFirstOrDefaultAsync<AppResponse<int>>
            (
                DapperConstants.usp_cmsSaveGroupSessionTokens,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Response(false, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            if (!result.IsSuccess)
                return AppResponse.Response(result.IsSuccess, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.InternalServerError));

            return AppResponse.Response(result.IsSuccess, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.OK));
        }

        private static async Task<bool> RemoveTokenIfExpired(int? sessionTokenId, double? tokenExpiry, IDbConnection connection, int userId, string ipAddress)
        {
            if (!(tokenExpiry > 0 && sessionTokenId > 0))
                return false;

            var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var utcToCheck = DateTime.UtcNow.AddDays(2);
            var totalSeconds = (utcToCheck - epoch).TotalSeconds;

            // Expecting token is live for at least two days
            if (tokenExpiry > totalSeconds)
                return false;

            _ = await DeleteGroupSessionTokens(connection, (sessionTokenId ?? 0), userId, ipAddress);

            return true;
        }

        private static async Task<AppResponse<GroupSessionTokensDto>> AddGroupSessionTokens(IDbConnection connection, GroupSessionTokensDto model, int userId, string ipAddress)
        {
            var dbParams = new
            {
                SessionTokenId = model.SessionTokenId,
                SessionId = model.SessionId,
                SessionInvitationId = model.SessionInvitationId,
                TokenKey = model.TokenKey,
                TokenExpiry = model.TokenExpiry,
                OrganizationId = model.OrganizationId,
                UserId = userId,
                IpAddress = ipAddress,
                Action = "A"
            };

            var result = await connection.QueryFirstOrDefaultAsync<AppResponse<int>>
            (
                DapperConstants.usp_cmsSaveGroupSessionTokens,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Fail(model, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            if (!result.IsSuccess)
                return AppResponse.Fail(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.InternalServerError));

            model.SessionTokenId = result.Data;

            return AppResponse.Success(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.OK));
        }

        private static async Task<AppResponse<GroupSessionRecordingsDto>> AddGroupSessionRecordings(IDbConnection connection, GroupSessionRecordingsDto model, int userId, string ipAddress)
        {
            var dbParams = new
            {
                SessionRecordingId = model.SessionRecordingId,
                SessionId = model.SessionId,
                ArchiveId = model.ArchiveId,
                SessionKey = model.SessionKey,
                AppointmentId = model.AppointmentId,
                OrganizationId = model.OrganizationId,
                UserId = userId,
                IpAddress = ipAddress,
                Action = "A"
            };

            var result = await connection.QueryFirstOrDefaultAsync<AppResponse<int>>
            (
                DapperConstants.usp_cmsSaveGroupSessionRecordings,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Fail(model, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            if (!result.IsSuccess)
                return AppResponse.Fail(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.InternalServerError));

            model.SessionRecordingId = result.Data;

            return AppResponse.Success(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.OK));
        }

        private static async Task<PortalUserDto> GetUserDetails(IDbConnection connection, int userId)
        {
            var dbParams = new
            {
                email = string.Empty,
                is_password = false,
                user_id = userId
            };

            var portal_user = (
                await connection.QueryFirstOrDefaultAsync<PortalUserDto>
                (
                    DapperConstants.usr_GetUserDetails,
                    dbParams,
                    commandType: CommandType.StoredProcedure
                )
            );

            return portal_user;
        }

        private static double GetDuration()
        {
            var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var utcNow = DateTime.UtcNow.AddDays(30);

            return (utcNow - epoch).TotalSeconds;
        }

        private static async Task SendInvitationEmailAsync
        (
            //IEmailService emailService,
            //IEmailTemplateProvider emailTemplateProvider,
            UserForInvitationDto user,
            ClientAppointmentsDto appointmentsDto,
            string initationUrl
        )
        {
            //var templateContents = emailTemplateProvider
            //    .GetTemplateContents(EmailTemplateOptions.AppointmentInvitation);

            var templateContents = string.Empty;

            if (string.IsNullOrWhiteSpace(templateContents))
                return;

            var tokens = new Dictionary<string, string>
            {
                { "{{user_name}}", user.UserFullName },
                { "{{provider_name}}", appointmentsDto.ProviderName },
                { "{{patient_name}}", appointmentsDto.ClientName },
                { "{{appointment_date}}", appointmentsDto.AppointmentDateTime.ToString("dddd, dd MMMM yyyy") },
                { "{{appointment_time}}", appointmentsDto.AppointmentDateTime.ToString("hh:mm tt") },
                { "{{invitation_url}}", initationUrl },
                { "{{povider_email}}", appointmentsDto.ProviderEmail },
                { "{{povider_phone}}", appointmentsDto.ProviderPhone },
            };

            foreach (var item in tokens)
                templateContents = templateContents.Replace(item.Key, item.Value);

            var subject = "New Group Session Invitation";
            var contents = templateContents;

            var options = new EmailOptions
            {
                Body = contents,
                Subject = subject,
                RecipientEmails = new string[] { user.Email }
            };

            _ = await Task.FromResult(0);

            //_ = await emailService.SendEmailAsync(options);
        }
    }
}
