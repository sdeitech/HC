namespace App.Core.Models.Common
{
    public class PropertyDifferenceDto
    {
        public int? TablePkId { get; set; }
        public string TableName { get; set; }
        public string PropertyName { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public string HistBatchId { get; set; }
        public string Mode { get; set; }
        public int? ClientId { get; set; }
        public int? OrganizationId { get; set; }
    }
}
