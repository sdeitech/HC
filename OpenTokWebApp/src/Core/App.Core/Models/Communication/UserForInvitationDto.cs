namespace App.Core.Models.Communication
{
    public class UserForInvitationDto
    {
        public int UserId { get; set; }
        public string UserFullName { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
        public bool IsSuccess { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public int? StatusCode { get; set; }
    }
}
