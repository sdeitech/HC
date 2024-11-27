using App.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using System;

namespace Infrastructure.Services.Common
{
    internal sealed class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int UserId => Convert.ToInt32(_httpContextAccessor.HttpContext?.User?.FindFirst("user_id")?.Value ?? "0");

        public string UserEmail
            => _httpContextAccessor.HttpContext?.User?.FindFirst("email")?.Value
            ?? _httpContextAccessor.HttpContext?.User?.FindFirst("email_id")?.Value;

        public string UserRole => _httpContextAccessor.HttpContext?.User?.FindFirst("role_name")?.Value;
        public string Origin => _httpContextAccessor?.HttpContext?.Request?.Headers?["origin"] ?? string.Empty;
        public string Referer => _httpContextAccessor?.HttpContext?.Request?.Headers?["referer"] ?? string.Empty;
        public int OrganizationId => Convert.ToInt32(_httpContextAccessor.HttpContext?.User?.FindFirst("organization_id")?.Value ?? "0");
        public string IpAddress =>
            _httpContextAccessor?.HttpContext?.Request?.Headers?["X-Ip-Address"] ??
            _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ??
            string.Empty;
        public string ScreenName => _httpContextAccessor?.HttpContext?.Request?.Headers?["X-Screen-Name"] ?? string.Empty;
        public string SubDomain => _httpContextAccessor?.HttpContext?.Request?.Headers?["X-Sub-Domain"] ?? string.Empty;
        public string OrganizationName => _httpContextAccessor.HttpContext?.User?.FindFirst("organization_name")?.Value ?? string.Empty;
        public string PortalType => _httpContextAccessor.HttpContext?.User?.FindFirst("portal_type")?.Value ?? string.Empty;
        public string DeviceId => _httpContextAccessor?.HttpContext?.Request?.Headers?["X-Device-Id"] ?? string.Empty;
        public int TimezoneOffset => Convert.ToInt32(_httpContextAccessor?.HttpContext?.Request?.Headers?["X-Timezone-Offset"] ?? "0");
        public string OriginUrl => _httpContextAccessor?.HttpContext?.Request?.Headers?["X-Origin-Url"] ?? string.Empty;
        //trans_id will be providerId if loggedin user is provider otherwise it will client_id.
        public int TransId => Convert.ToInt32(_httpContextAccessor.HttpContext?.User?.FindFirst("trans_id")?.Value ?? "0");
    }
}
