export interface IAuthResultDto {
    is_success: boolean;
    message: string;
    error_message: null;
    auth_token: string;
    otp_token: string;
}