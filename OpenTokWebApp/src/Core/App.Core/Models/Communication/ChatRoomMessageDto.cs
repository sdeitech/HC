using System;

namespace App.Core.Models.Communication
{
    public class ChatRoomMessageDto
    {
        public int MessageId { get; set; }
        public int RoomId { get; set; }
        public int FromUserId { get; set; }
        public string RoomMessage { get; set; }
        public int? OrganizationId { get; set; }
        public bool? IsMessage { get; set; }
        public bool? IsRecording { get; set; }
        public bool? IsFile { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public DateTime MessageDate { get; set; }
        public int TotalRecords { get; set; }
        public int AppointmentId { get; set; }
        public string FromUserName { get; set; }
    }
}