using System;

namespace App.Common.Models
{
    public sealed class ErrorDetails
    {
        public int ErrorId { get; set; }
        public int StatusCode { get; set; }
        public string ErrorDescription { get; set; }
        public string InnerException { get; set; }
        public string Source { get; set; }
        public string StackTrace { get; set; }
        public DateTime ErrorTime { get; set; }
        public int? UserId { get; set; }
    }
}
