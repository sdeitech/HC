namespace App.Common.Models
{
    public class AwsS3OptionsDto
    {
        public string AccessKey { get; set; }
        public string SecretKey { get; set; }
        public string RegionName { get; set; }
        public string BucketName { get; set; }

        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(AccessKey)
                && !string.IsNullOrWhiteSpace(SecretKey)
                && !string.IsNullOrWhiteSpace(RegionName)
                && !string.IsNullOrWhiteSpace(BucketName);
        }
    }
}
