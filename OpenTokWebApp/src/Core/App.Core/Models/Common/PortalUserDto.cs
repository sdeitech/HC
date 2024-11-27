namespace App.Core.Models.Common
{
    public sealed class PortalUserDto
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
        public int? RoleId { get; set; }
        public int? TransId { get; set; }
    }
}
