using Infrastructure.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;

namespace Infrastructure.Extensions
{
    public static class MvcOptionsExtensions
    {
        public static void AddApplicationFilters(this MvcOptions options)
        {
            var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();

            options.Filters.Add(new AuthorizeFilter(policy));
            options.Filters.Add<ModelStateValidationFilter>();
            options.Filters.Add<AppExceptionFilterAttribute>();
        }
    }
}
