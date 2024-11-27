namespace App.Core.Models.Auth
{
    public class AuthResponseDto
    {
        public bool is_success { get; set; }
        public string message { get; set; }
        public string error_message { get; set; }
        public string auth_token { get; set; }
        public string otp_token { get; set; }
    }
}
