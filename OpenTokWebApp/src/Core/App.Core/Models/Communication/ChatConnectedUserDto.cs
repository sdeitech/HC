namespace App.Core.Models.Communication
{
    public class ChatConnectedUserDto
    {
        public int Id { get; set; }
        public string ConnectionId { get; set; }
        public string DeviceId { get; set; }
        public int UserId { get; set; }
        public int TotalRecords { get; set; }
        public string FullName { get; set; }
        public string RoleName { get; set; }
        public string CallerName { get; set; }
        public string CallerRoleName { get; set; }
        public string InvitaionId { get; set; }
    }
}
