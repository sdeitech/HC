using App.Core.Interfaces.Communication;
using App.Core.Models.Communication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace WebUI.Controllers.Communication
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomMessageController : ControllerBase
    {
        private readonly ILogger<ChatRoomMessageController> _logger;
        private readonly IChatRoomMessageService _chatRoomMessageService;

        public ChatRoomMessageController
        (
            ILogger<ChatRoomMessageController> logger,
            IChatRoomMessageService chatRoomMessageService
        )
        {
            _logger = logger;
            _chatRoomMessageService = chatRoomMessageService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddChatRoomMessage(ChatRoomMessageDto model)
        {
            var result = await _chatRoomMessageService.AddChatRoomMessage(model);

            return Ok(result);
        }

        [HttpGet("[action]/{appointmentId}")]
        public async Task<IActionResult> GetChatRoomMessages(int appointmentId)
        {
            var result = await _chatRoomMessageService.GetChatRoomMessages(appointmentId);

            return Ok(result);
        }
    }
}