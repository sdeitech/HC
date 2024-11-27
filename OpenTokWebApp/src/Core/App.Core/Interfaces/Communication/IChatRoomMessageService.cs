using App.Common.Models;
using App.Core.Models.Communication;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace App.Core.Interfaces.Communication
{
    public interface IChatRoomMessageService
    {
        Task<AppResponse<ChatRoomMessageDto>> AddChatRoomMessage(ChatRoomMessageDto model);
        Task<AppResponse<List<ChatRoomMessageDto>>> GetChatRoomMessages(int appointmentId);
    }
}