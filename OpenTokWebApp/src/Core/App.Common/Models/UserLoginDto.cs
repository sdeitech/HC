namespace App.Common.Models
{
    public class UserLoginDto
    {
        public int RoleId { get; set; }
        public int MemberId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MobileNo { get; set; }
        public int OrganizationId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserTimeZone { get; set; }
        public int UserId { get; set; } = 0;
        public int loginUserId { get; set; }
    }

    public class UserCredentialDto
    {
        public int id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string email { get; set; }
        public string password_hash { get; set; }
        public string mobile_no { get; set; }
        public string user_timezone { get; set; }
        public string role_name { get; set; }
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; }

    }
}
