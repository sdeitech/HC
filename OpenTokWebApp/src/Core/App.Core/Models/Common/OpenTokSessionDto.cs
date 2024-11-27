namespace App.Core.Models.Common
{
    public class OpenTokSessionDto
    {
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
        public string SessionId { get; set; }
        public string Token { get; set; }
        public double? TokenExpiry { get; set; }
        public int? SessionTokenId { get; set; }
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int SessionInvitationId { get; set; }
        public string AccessToken { get; set; }
    }
}
