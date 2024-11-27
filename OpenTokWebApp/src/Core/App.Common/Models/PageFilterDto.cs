namespace App.Common.Models
{
    public class PageFilterDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortColumn { get; set; }
        public string SortOrder { get; set; } = "ASC";
        public string SearchText { get; set; }
    }
}
