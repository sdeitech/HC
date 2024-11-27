using App.Common.Models;
using App.Core.Models.Common;
using App.Core.Models.Communication;
using OpenTokSDK;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace App.Core.Interfaces.Communication
{
    public interface IOpenTokService
    {
        /// <summary>
        /// Object will be created based on configured values in site preferences.
        /// </summary>
        /// <returns></returns>
        OpenTokOptionsDto GetOpenTokOptions(int organizationId);

        /// <summary>
        /// Creates the opentock object basedon required inputs.
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        OpenTok GetOpenTokObject(int organizationId, OpenTokOptionsDto options = default);

        /// <summary>
        /// This function will be called irrespective of login.
        /// It will generate token keys only on the fly if missing.
        /// </summary>
        /// <param name="invitationId"></param>
        /// <returns></returns>
        Task<AppResponse<OpenTokSessionDto>> GetOpenTokSessionByInvitationId(string invitationId);

        /// <summary>
        /// This function will always be called after user login.
        /// It will generate session key and token keys always on the fly if missing.
        /// </summary>
        /// <param name="appointment"></param>
        /// <returns></returns>
        Task<AppResponse<OpenTokSessionDto>> GetOpenTokSessionByAppointmentId(int appointmentId);

        /// <summary>
        /// Handles front end request to start the video recording.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <returns></returns>
        Task<AppResponse<Archive>> StartVideoRecording(string sessionId);

        /// <summary>
        /// Handles front end request to stop the video recording.
        /// </summary>
        /// <param name="archiveId"></param>
        /// <param name="appointmentId"></param>
        /// <returns></returns>
        Task<AppResponse<ChatFileDto>> StopVideoRecording(string archiveId, int appointmentId);

        /// <summary>
        /// Responsible to return the video recordings
        /// </summary>
        /// <param name="archiveId"></param>
        /// <returns></returns>
        Task<AppResponse<Archive>> GetVideoRecording(string archiveId);

        /// <summary>
        /// The functions GetOpenTokSessionByInvitationId and/or GetOpenTokSessionByAppointmentId
        /// will return relevant object that will be saved in frontend localStorage.
        /// Once its saved successfully then this function will be called to notify other users
        /// that the call has been started.
        /// </summary>
        /// <param name="appointmentId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<AppResponse> CallInitiate(int appointmentId, int userId);

        /// <summary>
        /// If the user is not a client or its not in client portal only then
        /// this fuction will be called to notify that the call is completed.
        /// And those users who are in same call will be automatically
        /// logged out of the call.
        /// </summary>
        /// <param name="appointmentId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<AppResponse> CallEnd(int appointmentId, int userId);

        /// <summary>
        /// This function will be called if user picks or declines the incoming request call.
        /// This will notify this other tabs/devices that the call has been handled and incoming popup
        /// will be automatically closed.
        /// </summary>
        /// <param name="userConnectionId"></param>
        /// <returns></returns>
        Task<AppResponse> HandleIncomingCall(string userConnectionId);

        /// <summary>
        /// Searching internal users to send an invitation.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<AppResponse<List<UserForInvitationDto>>> GetUsersForInvitition(UserInvitationRequestDto model);

        /// <summary>
        /// Sends invitation to selected user from frontend.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<AppResponse> SendInvitation(InvitatedUserRequestDto model);
    }
}
