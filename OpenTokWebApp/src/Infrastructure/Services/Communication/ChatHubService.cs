using App.Common.Attributes;
using App.Core.Interfaces.Communication;
using App.Core.Models.Communication;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Services.Communication
{
    [TransientService]
    public class ChatHubService : IChatHubService
    {
        private readonly IHubContext<ChatHub> _chatHubContext;

        public ChatHubService(IHubContext<ChatHub> chatHubContext)
        {
            _chatHubContext = chatHubContext;
        }

        public async Task LogoutActiveConnections(List<string> connectionIds)
        {
            foreach (var connectionId in connectionIds)
                await _chatHubContext.Clients.Client(connectionId).SendAsync("PerformLogout");
        }

        public async Task NotifyCallInitiated(int appointmentId, int userId, List<ChatConnectedUserDto> connectedUsers)
        {
            foreach (var user in connectedUsers)
            {
                if (user.UserId == userId)
                    continue;

                await _chatHubContext.Clients.Client(user.ConnectionId).SendAsync("CallInitiated", appointmentId, userId, user.UserId, user.FullName, user.CallerName, user.CallerRoleName, user.InvitaionId);
            }
        }

        public async Task NotifyCallEnd(int appointmentId, int userId, List<ChatConnectedUserDto> connectedUsers)
        {
            foreach (var user in connectedUsers)
            {
                if (user.UserId == userId)
                    continue;

                await _chatHubContext.Clients.Client(user.ConnectionId).SendAsync("CallEnd", appointmentId, userId, user.UserId, user.FullName, user.RoleName, user.CallerName, user.CallerRoleName);
            }
        }

        public async Task NotifyIncomingCallHandled(List<string> connectionIds, string userConnectionId)
        {
            foreach (var connectionId in connectionIds)
            {
                if (string.Equals(connectionId, userConnectionId, StringComparison.InvariantCultureIgnoreCase))
                    continue;

                await _chatHubContext.Clients.Client(connectionId).SendAsync("IncomingCallHandled");
            }
        }

        public async Task NotifyMessageSent(int userId, List<ChatConnectedUserDto> connectedUsers)
        {
            foreach (var user in connectedUsers)
            {
                if (user.UserId == userId)
                    continue;

                await _chatHubContext.Clients.Client(user.ConnectionId).SendAsync("MessageSent");
            }
        }
    }
}
