using System.Collections.Generic;
using System.Security.Claims;

namespace App.Common.Interfaces
{
    public interface ITokenManager
    {
        string GenerateTokenFromClaims(IEnumerable<Claim> claims);
    }
}
