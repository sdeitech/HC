export interface IChatConnectedUserDto {
    id?: number;
    connectionId?: string;
    deviceId?: string;
    userId?: number;
    totalRecords?: number;
    fullName?: string;
    roleName?: string;
    callerName?: string;
    callerRoleName?: string;
    invitaionId?: string;
}