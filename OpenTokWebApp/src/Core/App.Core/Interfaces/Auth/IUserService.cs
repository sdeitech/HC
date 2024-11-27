using App.Core.Models.Auth;
using System.Threading.Tasks;

namespace App.Core.Interfaces.Auth
{
    public interface IUserService
    {
        Task<AuthResponseDto> AuthenticateUser(AuthRequestDto model);
    }
}
