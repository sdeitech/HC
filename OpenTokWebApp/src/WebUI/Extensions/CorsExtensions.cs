using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace WebUI.Extensions
{
    public static class CorsExtensions
    {
        private static readonly string _AllowSpecificOrigin = "AllowSpecificOrigin";

        public static IServiceCollection RegisterNamedCorsPolicy(this IServiceCollection services, params string[] origins)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(_AllowSpecificOrigin,
                    builder => builder
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithOrigins(origins)
                    );
            });

            return services;
        }

        public static IApplicationBuilder UseNamedCorsPolicy(this IApplicationBuilder app)
        {
            app.UseCors(_AllowSpecificOrigin);

            return app;
        }
    }
}
