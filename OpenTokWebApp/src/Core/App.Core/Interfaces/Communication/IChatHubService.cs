using App.Core.Models.Communication;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace App.Core.Interfaces.Communication
{
    public interface IChatHubService
    {
        Task LogoutActiveConnections(List<string> connectionIds);
        Task NotifyCallInitiated(int appointmentId, int userId, List<ChatConnectedUserDto> connectedUsers);
        Task NotifyCallEnd(int appointmentId, int userId, List<ChatConnectedUserDto> connectedUsers);
        Task NotifyIncomingCallHandled(List<string> connectionIds, string userConnectionId);
        Task NotifyMessageSent(int userId, List<ChatConnectedUserDto> connectedUsers);
    }
}
