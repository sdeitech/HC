export interface IChatRoomMessageDto {
    messageId?: number;
    roomId?: number;
    fromUserId: number;
    roomMessage: string;
    organizationId?: number;
    isMessage?: boolean;
    isRecording?: boolean;
    isFile?: boolean;
    fileName?: string;
    fileType?: string;
    messageDate?: string | Date;
    totalRecords?: number;
    appointmentId: number;
    fromUserName?: string;
}