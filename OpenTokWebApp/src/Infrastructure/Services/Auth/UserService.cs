using App.Common.Attributes;
using App.Common.Helpers;
using App.Common.Interfaces;
using App.Core.Extensions;
using App.Core.Interfaces.Auth;
using App.Core.Models.Auth;
using App.Core.Models.Common;
using System.Threading.Tasks;

namespace Infrastructure.Services.Auth
{
    [TransientService]
    public class UserService : IUserService
    {
        private readonly IDapperContext _dapperContext;
        private readonly ITokenManager _tokenManager;
        private readonly ICryptoManager _cryptoManager;

        public UserService(
           IDapperContext dapperContext,
           ITokenManager tokenManager,
           ICryptoManager cryptoManager
           )
        {
            _dapperContext = dapperContext;
            _tokenManager = tokenManager;
            _cryptoManager = cryptoManager;
        }

        public async Task<AuthResponseDto> AuthenticateUser(AuthRequestDto model)
        {
            var password = model.Password;

            // decrypting encrypted password recieved from frontend
            password = _cryptoManager.DecryptText(password);

            var checkPortal = PortalOptionsHelper.IsValidOrSuperAdmin(model.PortalType);

            if (!checkPortal.isValidPortal || checkPortal.isSuperAdmin)
                return new AuthResponseDto
                {
                    is_success = false,
                    error_message = "Invalid portal selection.",
                };

            var portal_user = new PortalUserDto
            {
                id = 1,
                first_name = "first name",
                last_name = "last name",
                email = model.Email,
                mobile_no = "+919876543210",
                user_timezone = "PST",
                role_name = "Admin",
                OrganizationId = 1,
                OrganizationName = "NA",
                RoleId = 1,
                TransId = 1,
            };

            var claims = portal_user.GetClaims(model.PortalType);
            var token = _tokenManager.GenerateTokenFromClaims(claims);

            var result = new AuthResponseDto
            {
                is_success = true,
                message = "User authenticated successfully.",
                auth_token = token,
                otp_token = _cryptoManager.EncryptText("123456"),
            };

            return await Task.FromResult(result);
        }
    }
}
