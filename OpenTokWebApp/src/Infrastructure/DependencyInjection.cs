using App.Common.Interfaces;
using App.Common.Models;
using App.Core.Extensions;
using Infrastructure.Extensions;
using Infrastructure.Services.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // reading configuration
            var jwtOptions = configuration
                .GetSection("JwtOptions")
                .Get<JwtOptions>();

            // reading configuration
            var cryptoOptions = configuration
                .GetSection("CryptoOptions")
                .Get<CryptoOptions>();

            // reading configuration
            var openTokOptions = configuration
                .GetSection("OpenTokOptions")
                .Get<OpenTokOptionsDto>();

            services.AddSingleton(jwtOptions);
            services.AddSingleton(cryptoOptions);
            services.AddSingleton(openTokOptions);
            services.AddSingleton<ITokenManager, TokenManager>();
            services.AddSingleton<ICryptoManager, CryptoManager>();

            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IDapperContext, DapperContext>();

            services.RegisterApplicationServices(Assembly.GetExecutingAssembly());
            services.AddHttpClient();

            services.AddJWTAuthentication(jwtOptions);

            return services;
        }
    }
}
