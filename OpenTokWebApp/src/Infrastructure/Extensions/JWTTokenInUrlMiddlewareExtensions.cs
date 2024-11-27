using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Extensions
{
    public static class JWTTokenInUrlMiddlewareExtensions
    {
        public static IApplicationBuilder UseJWTTokenInUrl(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JWTTokenInUrlMiddleware>();
        }
    }

    public sealed class JWTTokenInUrlMiddleware
    {
        private readonly RequestDelegate _next;

        public JWTTokenInUrlMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            var request = httpContext.Request;
            var token = request.Query["token"];

            if (!string.IsNullOrEmpty(token) && string.IsNullOrEmpty(request.Headers["Authorization"]))
                request.Headers.Append("Authorization", $"Bearer {token}");

            await _next(httpContext);
        }
    }
}
