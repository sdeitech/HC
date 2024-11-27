using System.Collections.Generic;

namespace App.Core.Models.Communication
{
    public class InvitatedUserRequestDto
    {
        public int AppointmentId { get; set; }
        public List<UserForInvitationDto> UserForInvitations { get; set; }
    }
}
