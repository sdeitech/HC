namespace App.Core.Models.Common
{
    public class OrgDetailDto
    {
        public int OrganizationsDetailId { get; set; }
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public string OrganizationDetails { get; set; }
        public string Email { get; set; }
        public string MobileNo { get; set; }
        public string Address { get; set; }
        public string ImagePath { get; set; }
        public string ContactPersonFirstName { get; set; }
        public string ContactPersonMiddleName { get; set; }
        public string ContactPersonLastName { get; set; }
        public string ContactPersonEmail { get; set; }
        public string ContactPersonMobileNo { get; set; }
        public int? CountryId { get; set; }
        public int? StateId { get; set; }
        public string City { get; set; }
        public int? DatabaseDetailId { get; set; }
        public int? ContactPersonSuffix { get; set; }
        public int OrganizationTypeId { get; set; }
        public string OrganizationAccountNumber { get; set; }
        public bool VIP { get; set; }
        public int? ZipCode { get; set; }
        public int? ZipExtension { get; set; }
        public string OpeningTime { get; set; }
        public string Businessname { get; set; }
        public int TotalRecords { get; set; }
    }
}
