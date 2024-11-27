using App.Core.Models.Common;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace App.Core.Extensions
{
    public static class PortalUserExtensions
    {
        public static List<Claim> GetClaims(this PortalUserDto portalUser, string portalType)
        {
            return new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, $"{portalUser.first_name} {portalUser.last_name}"),
                new Claim(JwtRegisteredClaimNames.NameId, portalUser.id.ToString()),
                new Claim("user_id", portalUser.id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, portalUser.email),
                new Claim("email_id", portalUser.email),
                new Claim(JwtRegisteredClaimNames.GivenName, $"{portalUser.first_name} {portalUser.last_name}"),
                new Claim("role_name", portalUser.role_name),
                new Claim("organization_id", portalUser.OrganizationId.ToString()),
                new Claim("organization_name", portalUser.OrganizationName),
                new Claim("portal_type", portalType),
                new Claim("role_id", (portalUser.RoleId ?? 0).ToString()),
                new Claim("trans_id", (portalUser.TransId ?? 0).ToString()),
            };
        }
    }
}
