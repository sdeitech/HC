namespace App.Common.Interfaces
{
    public interface ICurrentUserService
    {
        int UserId { get; }
        string UserEmail { get; }
        string UserRole { get; }

        /// <summary>
        /// Excluding few exceptions almost all browsers sends this header.
        /// Reference - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin
        /// </summary>
        string Origin { get; }

        /// <summary>
        /// Excluding few exceptions almost all browsers sends this header.
        /// Reference - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer
        /// </summary>
        string Referer { get; }

        int OrganizationId { get; }
        string IpAddress { get; }
        string ScreenName { get; }
        string SubDomain { get; }
        string OrganizationName { get; }
        string PortalType { get; }
        string DeviceId { get; }
        int TimezoneOffset { get; }
        string OriginUrl { get; }
        int TransId { get; }
    }
}
