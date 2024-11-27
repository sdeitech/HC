CREATE TABLE [cms].[ChatRoomUser] (
    [ChatRoomUserId]        INT            IDENTITY (1, 1) NOT NULL,
    [RoomId]                INT            NOT NULL,
    [ChatUserId]            INT            NOT NULL,
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
    CONSTRAINT [PK_ChatRoomUser] PRIMARY KEY CLUSTERED ([ChatRoomUserId] ASC),
    CONSTRAINT [FK_ChatRoomUser_ChatRoom_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [cms].[ChatRoom] ([ChatRoomId])
);

