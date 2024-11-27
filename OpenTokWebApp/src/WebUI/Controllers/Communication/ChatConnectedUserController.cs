using App.Common.Models;
using App.Core.Interfaces.Communication;
using App.Core.Models.Communication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace WebUI.Controllers.Communication
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatConnectedUserController : ControllerBase
    {
        private readonly ILogger<ChatConnectedUserController> _logger;
        private readonly IChatConnectedUserService _chatConnectedUserService;

        public ChatConnectedUserController
        (
            ILogger<ChatConnectedUserController> logger,
            IChatConnectedUserService chatConnectedUserService
        )
        {
            _logger = logger;
            _chatConnectedUserService = chatConnectedUserService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddChatConnectedUser(ChatConnectedUserDto model)
        {
            var result = await _chatConnectedUserService.AddChatConnectedUser(model);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateChatConnectedUser(ChatConnectedUserDto model)
        {
            var result = await _chatConnectedUserService.UpdateChatConnectedUser(model);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetChatConnectedUserList(PageFilterDto model)
        {
            var result = await _chatConnectedUserService.GetChatConnectedUserList(model);

            return Ok(result);
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetChatConnectedUserById(int id)
        {
            var result = await _chatConnectedUserService.GetChatConnectedUserById(id);

            return Ok(result);
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetChatConnectedUserByUserId(int userId)
        {
            var result = await _chatConnectedUserService.GetChatConnectedUserByUserId(userId);

            return Ok(result);
        }

        [HttpPost("[action]/{userId}")]
        public async Task<IActionResult> DeleteChatConnectedUser(int userId)
        {
            var result = await _chatConnectedUserService.DeleteChatConnectedUser(userId);

            return Ok(result);
        }
    }
}