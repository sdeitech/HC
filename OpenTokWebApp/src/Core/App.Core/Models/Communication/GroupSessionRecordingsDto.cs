namespace App.Core.Models.Communication
{
    public class GroupSessionRecordingsDto
    {
        public int SessionRecordingId { get; set; }
        public int SessionId { get; set; }
        public string ArchiveId { get; set; }
        public int TotalRecords { get; set; }
        public string SessionKey { get; set; }
        public int? AppointmentId { get; set; }
        public int? OrganizationId { get; set; }
    }
}