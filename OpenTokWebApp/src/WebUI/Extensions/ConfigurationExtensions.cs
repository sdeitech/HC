using Microsoft.Extensions.Configuration;

namespace WebUI.Extensions
{
    public static class ConfigurationExtensions
    {
        public static string[] GetOrigins(this IConfiguration configuration)
        {
            return configuration
                .GetSection("AllowedOrigins")
                .Get<string[]>();
        }
    }
}
