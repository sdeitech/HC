﻿CREATE TABLE [org].[User] (
    [UserId]                INT            IDENTITY (1, 1) NOT NULL,
    [FirstName]             NVARCHAR (100) NOT NULL,
    [LastName]              NVARCHAR (100) NULL,
    [Email]                 NVARCHAR (500) NOT NULL,
    [Password]              NVARCHAR (100) NOT NULL,
    [MobileNo]              NVARCHAR (20)  NOT NULL,
    [RoleId]                INT            NULL,
    [UserTimeZone]          NVARCHAR (3)   NULL,
    [ForgotToken]           NVARCHAR (50)  NULL,
    [OTPtoken]              NVARCHAR (10)  NULL,
    [OTPexpiry]             DATETIME2 (7)  NULL,
    [IsActive]              BIT            CONSTRAINT [df_org_User_IsActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]             BIT            CONSTRAINT [df_org_User_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedBy]             INT            CONSTRAINT [df_org_User_CreatedBy] DEFAULT ((0)) NOT NULL,
    [CreatedOn]             DATETIME2 (7)  CONSTRAINT [df_org_User_CreatedOn] DEFAULT (getutcdate()) NOT NULL,
    [LastModifiedBy]        INT            NULL,
    [LastModifiedOn]        DATETIME2 (7)  NULL,
    [Guid]                  NVARCHAR (50)  NULL,
    [OrganizationId]        INT            NULL,
    [CreatedIpAddress]      NVARCHAR (MAX) NULL,
    [DeletedBy]             INT            NULL,
    [DeletedIpAddress]      NVARCHAR (MAX) NULL,
    [DeletedOn]             DATETIME2 (7)  NULL,
    [LastModifiedIpAddress] NVARCHAR (MAX) NULL,
    [IsLoggedin]            BIT            NULL,
    [LastLoggedinTime]      DATETIME2 (7)  NULL,
    [LastLoggedoutTime]     DATETIME2 (7)  NULL,
    [ProfileImage]          NVARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([UserId] ASC)
);

