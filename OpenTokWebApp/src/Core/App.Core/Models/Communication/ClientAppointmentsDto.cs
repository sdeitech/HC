using System;

namespace App.Core.Models.Communication
{
    public class ClientAppointmentsDto
    {
        public int AppointmentId { get; set; }
        public int? ClientId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? StartTime { get; set; }
        public int LocationID { get; set; }
        public int? AppointmentTypeId { get; set; }
        public int? OrgMemberId { get; set; }
        public string Notes { get; set; }
        public int? ColorID { get; set; }
        public int? StatusId { get; set; }
        public DateTime? EndTime { get; set; }
        public decimal? Fees { get; set; }
        public bool? isNonPatient { get; set; }
        public string ChooseRoom { get; set; }
        public string ModifierId { get; set; }
        public int? RecurringAppointmentId { get; set; }
        public bool? isRecurring { get; set; }
        public string ServiceUnit { get; set; }
        public bool isSentReminderMail { get; set; }
        public bool isSentSMS { get; set; }
        public bool isPrimeToBill { get; set; }
        public bool? isPaynow { get; set; }
        public int? ClaimsCPTId { get; set; }
        public bool? isCheckIn { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public bool? isResendLink { get; set; }
        public int TotalRecords { get; set; }

        // Extra columns for session token creation
        public int? ClientUserId { get; set; }
        public int? AppointmentUserId { get; set; }
        public string ClientName { get; set; }
        public string ProviderName { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public string ProviderPhone { get; set; }
        public string ProviderEmail { get; set; }
    }
}
