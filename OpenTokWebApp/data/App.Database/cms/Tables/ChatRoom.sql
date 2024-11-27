CREATE TABLE [cms].[ChatRoom] (
    [ChatRoomId]            INT            IDENTITY (1, 1) NOT NULL,
    [RoomName]              NVARCHAR (MAX) NOT NULL,
    [AppointmentId]         INT            NULL,
    [OrganizationId]        INT            NULL,
    [CreatedBy]             INT            NOT NULL,
    [CreatedOn]             DATETIME2 (7)  NOT NULL,
    [CreatedIpAddress]      NVARCHAR (MAX) NULL,
    [LastModifiedBy]        INT            NULL,
    [LastModifiedOn]        DATETIME2 (7)  NULL,
    [LastModifiedIpAddress] NVARCHAR (MAX) NULL,
    [IsActive]              BIT            NOT NULL,
    [IsDeleted]             BIT            NOT NULL,
    [DeletedBy]             INT            NULL,
    [DeletedOn]             DATETIME2 (7)  NULL,
    [DeletedIpAddress]      NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_ChatRoom] PRIMARY KEY CLUSTERED ([ChatRoomId] ASC)
);

