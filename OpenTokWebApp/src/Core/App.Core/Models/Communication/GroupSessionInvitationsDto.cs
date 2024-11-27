using System;

namespace App.Core.Models.Communication
{
    public class GroupSessionInvitationsDto
    {
        public int SessionInvitationId { get; set; }
        public int SessionId { get; set; }
        public int? AppointmentId { get; set; }
        public int? UserId { get; set; }
        public Guid? InvitaionId { get; set; }
        public int? OrganizationId { get; set; }
        public int? ClientId { get; set; }
        public int TotalRecords { get; set; }
    }
}
