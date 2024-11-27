namespace App.Common.Models
{
    public sealed class JwtOptions
    {
        public string Key { get; init; }
        public string Issuer { get; init; }
        public string Audience { get; init; }
        public double ExpireInMinutes { get; init; }
    }
}
