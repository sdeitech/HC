using App.Core.Interfaces.Communication;
using App.Core.Models.Communication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace WebUI.Controllers.Communication
{
    [Route("api/[controller]")]
    [ApiController]
    public class OpenTokController : ControllerBase
    {
        private readonly ILogger<OpenTokController> _logger;
        private readonly IOpenTokService _openTokService;

        public OpenTokController
        (
            ILogger<OpenTokController> logger,
            IOpenTokService openTokService
        )
        {
            _logger = logger;
            _openTokService = openTokService;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> GetOpenTokSessionByInvitationId(InvitationRequestDto model)
        {
            var result = await _openTokService.GetOpenTokSessionByInvitationId(model.InvitationId);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetOpenTokSessionByAppointmentId(AppointmentRequestDto model)
        {
            var result = await _openTokService.GetOpenTokSessionByAppointmentId(model.AppointmentId);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> StartVideoRecording(VideoRecordingStartRequestDto model)
        {
            var result = await _openTokService.StartVideoRecording(model.SessionId);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> StopVideoRecording(VideoRecordingStopRequestDto model)
        {
            var result = await _openTokService.StopVideoRecording(model.ArchiveId, model.AppointmentId);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetVideoRecording(VideoRecordingRequestDto model)
        {
            var result = await _openTokService.GetVideoRecording(model.ArchiveId);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CallInitiate(CallInitiateRequestDto model)
        {
            var result = await _openTokService.CallInitiate(model.AppointmentId, model.UserId);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CallEnd(CallEndRequestDto model)
        {
            var result = await _openTokService.CallEnd(model.AppointmentId, model.UserId);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> HandleIncomingCall(UserConnectionIdDto model)
        {
            var result = await _openTokService.HandleIncomingCall(model.UserConnectionId);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetUsersForInvitition(UserInvitationRequestDto model)
        {
            var result = await _openTokService.GetUsersForInvitition(model);

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SendInvitation(InvitatedUserRequestDto model)
        {
            var result = await _openTokService.SendInvitation(model);

            return Ok(result);
        }
    }
}
