export interface IUserForInvitationDto {
    userId: number;
    userFullName: string;
    email: string;
    roleName: string;
    isSuccess: boolean;
    message: string;
    statusCode: number;
}