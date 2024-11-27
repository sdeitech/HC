using System;

namespace App.Common.Models
{
    public class FileDetailDto
    {
        public byte[] FileData { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
        public string FileSizeInKb { get; set; }
        public long FileSizeInBytes { get; set; }

        public string ToBase64String()
        {
            if (FileData == null || FileData.Length == 0 || string.IsNullOrWhiteSpace(ContentType))
                return string.Empty;

            return $"data:{ContentType};base64,{Convert.ToBase64String(FileData)}";
        }
    }
}
