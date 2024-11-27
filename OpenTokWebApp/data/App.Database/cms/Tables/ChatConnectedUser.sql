CREATE TABLE [cms].[ChatConnectedUser] (
    [Id]                    INT            IDENTITY (1, 1) NOT NULL,
    [ConnectionId]          NVARCHAR (MAX) NULL,
    [CreatedDate]           DATETIME2 (7)  DEFAULT (getutcdate()) NOT NULL,
    [UpdatedDate]           DATETIME2 (7)  NULL,
    [UserId]                INT            NOT NULL,
    [CreatedBy]             INT            CONSTRAINT [df_cms_ChatConnectedUser_CreatedBy] DEFAULT ((0)) NOT NULL,
    [DeletedBy]             INT            NULL,
    [DeletedDate]           DATETIME2 (7)  NULL,
    [UpdatedBy]             INT            NULL,
    [IsActive]              BIT            CONSTRAINT [df_cms_ChatConnectedUser_IsActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]             BIT            CONSTRAINT [df_cms_ChatConnectedUser_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedIpAddress]      NVARCHAR (MAX) NULL,
    [CreatedOn]             DATETIME2 (7)  CONSTRAINT [df_cms_ChatConnectedUser_CreatedOn] DEFAULT (getutcdate()) NOT NULL,
    [DeletedIpAddress]      NVARCHAR (MAX) NULL,
    [DeletedOn]             DATETIME2 (7)  NULL,
    [LastModifiedBy]        INT            NULL,
    [LastModifiedIpAddress] NVARCHAR (MAX) NULL,
    [LastModifiedOn]        DATETIME2 (7)  NULL,
    [DeviceId]              NVARCHAR (MAX) NULL
);

