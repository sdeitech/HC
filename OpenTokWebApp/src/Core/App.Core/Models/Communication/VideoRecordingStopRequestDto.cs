namespace App.Core.Models.Communication
{
    public class VideoRecordingStopRequestDto
    {
        public string ArchiveId { get; set; }
        public int AppointmentId { get; set; }
    }
}
