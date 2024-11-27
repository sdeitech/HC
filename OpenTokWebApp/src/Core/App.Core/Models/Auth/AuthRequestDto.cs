namespace App.Core.Models.Auth
{
    public class AuthRequestDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string PortalType { get; set; }
        public string OrgnizationKey { get; set; }
    }
}
