using System.Collections.Generic;

namespace App.Core.Models.Communication
{
    public class AppointmentAndSessionDetailsDto
    {
        public ClientAppointmentsDto ClientAppointments { get; set; }
        public GroupSessionsDto GroupSessions { get; set; }
        public List<GroupSessionInvitationsDto> GroupSessionInvitations { get; set; }
        public List<GroupSessionTokensDto> GroupSessionTokens { get; set; }
    }
}
