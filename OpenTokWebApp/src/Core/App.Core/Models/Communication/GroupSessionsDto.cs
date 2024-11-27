using System;

namespace App.Core.Models.Communication
{
    public class GroupSessionsDto
    {
        public int SessionId { get; set; }
        public string SessionKey { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? OrganizationId { get; set; }
        public int TotalRecords { get; set; }
    }
}
