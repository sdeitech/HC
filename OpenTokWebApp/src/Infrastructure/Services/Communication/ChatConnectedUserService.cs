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
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services.Communication
{
    [TransientService]
    public class ChatConnectedUserService : IChatConnectedUserService
    {
        private readonly IDapperContext _dapperContext;
        private readonly ICurrentUserService _currentUserService;

        public ChatConnectedUserService(IDapperContext dapperContext, ICurrentUserService currentUserService)
        {
            _dapperContext = dapperContext;
            _currentUserService = currentUserService;
        }

        public async Task<AppResponse<ChatConnectedUserDto>> AddChatConnectedUser(ChatConnectedUserDto model)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();

            var dbParams = new
            {
                ConnectionId = model.ConnectionId,
                UserId = model.UserId,
                DeviceId = _currentUserService.DeviceId,
                IpAddress = _currentUserService.IpAddress,
                Action = "A"
            };

            var result = await connection.QueryFirstOrDefaultAsync<AppResponse<int>>
            (
                DapperConstants.usp_cmsSaveChatConnectedUser,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Fail(model, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            if (!result.IsSuccess)
                return AppResponse.Fail(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.InternalServerError));

            model.Id = result.Data;

            return AppResponse.Success(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.OK));
        }

        public async Task<AppResponse<ChatConnectedUserDto>> UpdateChatConnectedUser(ChatConnectedUserDto model)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();

            var dbParams = new
            {
                ConnectionId = model.ConnectionId,
                UserId = _currentUserService.UserId,
                DeviceId = _currentUserService.DeviceId,
                IpAddress = _currentUserService.IpAddress,
                Action = "U"
            };

            var result = await connection.QueryFirstOrDefaultAsync<AppResponse<int>>
            (
                DapperConstants.usp_cmsSaveChatConnectedUser,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Fail(model, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            if (!result.IsSuccess)
                return AppResponse.Fail(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.InternalServerError));

            return AppResponse.Success(model, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.OK));
        }

        public async Task<PagedResultDto<ChatConnectedUserDto>> GetChatConnectedUserList(PageFilterDto model)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();

            var dbParams = new
            {
                PageNumber = model.PageNumber,
                PageSize = model.PageSize,
                SortColumn = model.SortColumn,
                SortOrder = model.SortOrder,
                SearchText = model.SearchText,
            };

            var result = (
                await connection.QueryAsync<ChatConnectedUserDto>
                (
                    DapperConstants.usp_cmsGetChatConnectedUserList,
                    dbParams,
                    commandType: CommandType.StoredProcedure
                )
            ).AsList();

            return new PagedResultDto<ChatConnectedUserDto>
            {
                Records = result,
                PageNumber = model.PageNumber,
                PageSize = model.PageSize,
                TotalRecords = result.FirstOrDefault()?.TotalRecords ?? 0,
            };
        }

        public async Task<AppResponse<ChatConnectedUserDto>> GetChatConnectedUserById(int id)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();

            var dbParams = new
            {
                Id = id,
            };

            var result = await connection.QueryFirstOrDefaultAsync<ChatConnectedUserDto>
            (
                DapperConstants.usp_cmsGetChatConnectedUserById,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Fail(result, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            return AppResponse.Success(result);
        }

        public async Task<AppResponse<ChatConnectedUserDto>> GetChatConnectedUserByUserId(int userId)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();

            var dbParams = new
            {
                UserId = userId,
            };

            var result = await connection.QueryFirstOrDefaultAsync<ChatConnectedUserDto>
            (
                DapperConstants.usp_cmsGetChatConnectedUserByUserId,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Fail(result, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            return AppResponse.Success(result);
        }

        public async Task<AppResponse> DeleteChatConnectedUser(int userId)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();

            var dbParams = new
            {
                UserId = userId,
                IpAddress = _currentUserService.IpAddress,
                DeviceId = _currentUserService.DeviceId,
                Action = "D"
            };

            var result = await connection.QueryFirstOrDefaultAsync<AppResponse<int>>
            (
                DapperConstants.usp_cmsSaveChatConnectedUser,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null)
                return AppResponse.Response(false, CommonMessageTemplates.NotFound, HttpStatusCodes.NotFound);

            if (!result.IsSuccess)
                return AppResponse.Response(result.IsSuccess, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.InternalServerError));

            return AppResponse.Response(result.IsSuccess, result.Message, HttpStatusCodesHelper.GetHttpStatusCode(result.StatusCode, HttpStatusCodes.OK));
        }

        public async Task<List<string>> GetActiveUserConnections(int userId, string deviceId)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();

            var dbParams = new
            {
                UserId = userId,
                DeviceId = deviceId
            };

            var result = (await connection.QueryAsync<string>
            (
                DapperConstants.usp_cmsGetActiveUserConnections,
                dbParams,
                commandType: CommandType.StoredProcedure
            )).AsList();

            return result;
        }

        public async Task<List<string>> GetAllActiveUserConnections(int userId)
        {
            using var connection = _dapperContext.CreateOrganizationConnection();

            var dbParams = new
            {
                UserId = userId,
            };

            var result = (await connection.QueryAsync<string>
            (
                DapperConstants.usp_cmsGetAllActiveUserConnections,
                dbParams,
                commandType: CommandType.StoredProcedure
            )).AsList();

            return result;
        }

        public async Task<List<ChatConnectedUserDto>> GetConnectedUsersForAppointment(IDbConnection connection, int appointmentId, int organizationId, int callerId)
        {
            var dbParams = new
            {
                AppointmentId = appointmentId,
                OrganizationId = organizationId,
                CallerId = callerId,
            };

            var result = (await connection.QueryAsync<ChatConnectedUserDto>
            (
                DapperConstants.usp_cmsGetConnectedUsersForAppointment,
                dbParams,
                commandType: CommandType.StoredProcedure
            )).AsList();

            return result;
        }
    }
}