using App.Common.Attributes;
using App.Common.Constants;
using App.Common.Helpers;
using App.Common.Interfaces;
using App.Common.Models;
using App.Core.Interfaces.Communication;
using App.Core.Models.Communication;
using Dapper;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Infrastructure.Services.Communication
{
    [TransientService]
    public class ChatRoomMessageService : IChatRoomMessageService
    {
        private readonly IDapperContext _dapperContext;
        private readonly ICurrentUserService _currentUserService;
        private readonly IChatConnectedUserService _chatConnectedUserService;
        private readonly IChatHubService _chatHubService;

        public ChatRoomMessageService
        (
            IDapperContext dapperContext,
            ICurrentUserService currentUserService,
            IChatConnectedUserService chatConnectedUserService,
            IChatHubService chatHubService
        )
        {
            _dapperContext = dapperContext;
            _currentUserService = currentUserService;
            _chatConnectedUserService = chatConnectedUserService;
            _chatHubService = chatHubService;
        }

        public async Task<AppResponse<ChatRoomMessageDto>> AddChatRoomMessage(ChatRoomMessageDto model)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();
            var organizationId = model.OrganizationId ?? _currentUserService.OrganizationId;

            var dbParams = new
            {
                AppointmentId = model.AppointmentId,
                MessageId = model.MessageId,
                RoomId = model.RoomId,
                FromUserId = model.FromUserId,
                RoomMessage = model.RoomMessage,
                OrganizationId = organizationId,
                IsMessage = model.IsMessage,
                IsRecording = model.IsRecording,
                IsFile = model.IsFile,
                FileName = model.FileName,
                FileType = model.FileType,
                MessageDate = model.MessageDate,
                UserId = _currentUserService.UserId,
                IpAddress = _currentUserService.IpAddress,
                Action = "A"
            };

            var result = await connection.QueryFirstOrDefaultAsync<AppResponse<int>>
            (
                DapperConstants.usp_cmsSaveChatRoomMessage,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Fail(model, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            if (!result.IsSuccess)
                return AppResponse.Fail(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.InternalServerError));

            model.MessageId = result.Data;

            var list = await _chatConnectedUserService.GetConnectedUsersForAppointment(connection, model.AppointmentId, organizationId, model.FromUserId);

            await _chatHubService.NotifyMessageSent(model.FromUserId, list);

            return AppResponse.Success(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.OK));
        }

        public async Task<AppResponse<List<ChatRoomMessageDto>>> GetChatRoomMessages(int appointmentId)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();

            var dbParams = new
            {
                AppointmentId = appointmentId,
                LoggedInUserId = _currentUserService.UserId,
                OrganizationId = _currentUserService.OrganizationId,
            };

            var list = (await connection.QueryAsync<ChatRoomMessageDto>
            (
                DapperConstants.usp_cmsGetChatRoomMessages,
                dbParams,
                commandType: CommandType.StoredProcedure
            )).AsList();

            return AppResponse.Success(list);
        }
    }
}