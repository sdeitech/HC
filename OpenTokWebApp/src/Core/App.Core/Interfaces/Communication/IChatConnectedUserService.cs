using App.Common.Models;
using App.Core.Models.Communication;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace App.Core.Interfaces.Communication
{
    public interface IChatConnectedUserService
    {
        Task<AppResponse<ChatConnectedUserDto>> AddChatConnectedUser(ChatConnectedUserDto model);
        Task<AppResponse<ChatConnectedUserDto>> UpdateChatConnectedUser(ChatConnectedUserDto model);
        Task<PagedResultDto<ChatConnectedUserDto>> GetChatConnectedUserList(PageFilterDto model);
        Task<AppResponse<ChatConnectedUserDto>> GetChatConnectedUserById(int id);
        Task<AppResponse<ChatConnectedUserDto>> GetChatConnectedUserByUserId(int userId);
        Task<AppResponse> DeleteChatConnectedUser(int userId);
        Task<List<string>> GetActiveUserConnections(int userId, string deviceId);
        Task<List<string>> GetAllActiveUserConnections(int userId);
        Task<List<ChatConnectedUserDto>> GetConnectedUsersForAppointment(IDbConnection connection, int appointmentId, int organizationId, int callerId);
    }
}
