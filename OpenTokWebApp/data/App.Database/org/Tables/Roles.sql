CREATE TABLE [org].[Roles] (
    [RoleId]                INT            IDENTITY (1, 1) NOT NULL,
    [RoleName]              NVARCHAR (100) NOT NULL,
    [CodeKey]               NVARCHAR (100) NULL,
    [IsActive]              BIT            CONSTRAINT [df_org_Roles_IsActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]             BIT            CONSTRAINT [df_org_Roles_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedBy]             INT            CONSTRAINT [df_org_Roles_CreatedBy] DEFAULT ((0)) NOT NULL,
    [CreatedOn]             DATETIME2 (7)  CONSTRAINT [df_org_Roles_CreatedOn] DEFAULT (getutcdate()) NOT NULL,
    [LastModifiedBy]        INT            NULL,
    [LastModifiedOn]        DATETIME2 (7)  NULL,
    [CreatedIpAddress]      NVARCHAR (MAX) NULL,
    [DeletedBy]             INT            NULL,
    [DeletedIpAddress]      NVARCHAR (MAX) NULL,
    [DeletedOn]             DATETIME2 (7)  NULL,
    [LastModifiedIpAddress] NVARCHAR (MAX) NULL,
    [IsSystem]              BIT            NULL,
    PRIMARY KEY CLUSTERED ([RoleId] ASC)
);

