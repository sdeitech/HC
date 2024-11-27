namespace App.Core.Models.Communication
{
    public class ChatFileDto
    {
        public string FileName { get; set; }
        public string Message { get; set; }
        public string FileType { get; set; }
        public int MessageType { get; set; }
        public int RoomId { get; set; }
        public bool IsRecieved { get; set; } = true;
        public bool? IsRecording { get; set; }
        public bool? IsFile { get; set; }
    }
}
