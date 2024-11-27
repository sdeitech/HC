import { IUserForInvitationDto } from "./user-for-invitation";

export interface IInvitatedUserRequestDto {
    appointmentId: number;
    userForInvitations: IUserForInvitationDto[];
}
