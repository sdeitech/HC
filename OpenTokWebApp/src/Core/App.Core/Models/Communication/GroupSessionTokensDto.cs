namespace App.Core.Models.Communication
{
    public class GroupSessionTokensDto
    {
        public int SessionTokenId { get; set; }
        public int SessionId { get; set; }
        public int? SessionInvitationId { get; set; }
        public string TokenKey { get; set; }
        public double TokenExpiry { get; set; }
        public int OrganizationId { get; set; }
        public int TotalRecords { get; set; }
    }
}
