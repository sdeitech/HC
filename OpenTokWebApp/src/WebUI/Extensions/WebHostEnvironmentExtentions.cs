using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace WebUI.Extensions
{
    public static class WebHostEnvironmentExtentions
    {
        public static IWebHostEnvironment ContigureWebRootPath(this IWebHostEnvironment env)
        {
            if (string.IsNullOrWhiteSpace(env.WebRootPath))
                env.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            return env;
        }
    }
}
