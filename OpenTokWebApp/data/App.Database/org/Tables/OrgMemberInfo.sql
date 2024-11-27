﻿CREATE TABLE [org].[OrgMemberInfo] (
    [OrgMemberId]           INT            IDENTITY (1, 1) NOT NULL,
    [OrganizationId]        INT            NOT NULL,
    [FirstName]             VARCHAR (50)   NOT NULL,
    [LastName]              VARCHAR (50)   NOT NULL,
    [MiddleName]            VARCHAR (50)   NOT NULL,
    [SuffixId]              INT            NULL,
    [DisplayName]           VARCHAR (50)   NOT NULL,
    [DateOfBirth]           DATETIME2 (7)  NULL,
    [TaxIdOrSSN]            VARCHAR (50)   NOT NULL,
    [UserName]              VARCHAR (50)   NOT NULL,
    [Password]              VARCHAR (50)   NOT NULL,
    [IsClinicalMember]      BIT            NOT NULL,
    [CreatedBy]             INT            CONSTRAINT [df_org_OrgMemberInfo_CreatedBy] DEFAULT ((0)) NOT NULL,
    [CreatedOn]             DATETIME2 (7)  CONSTRAINT [df_org_OrgMemberInfo_CreatedOn] DEFAULT (getutcdate()) NOT NULL,
    [CreatedIpAddress]      NVARCHAR (MAX) NULL,
    [LastModifiedBy]        INT            NULL,
    [LastModifiedOn]        DATETIME2 (7)  NULL,
    [LastModifiedIpAddress] NVARCHAR (MAX) NULL,
    [IsActive]              BIT            CONSTRAINT [df_org_OrgMemberInfo_IsActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]             BIT            CONSTRAINT [df_org_OrgMemberInfo_IsDeleted] DEFAULT ((0)) NOT NULL,
    [DeletedBy]             INT            NULL,
    [DeletedOn]             DATETIME2 (7)  NULL,
    [DeletedIpAddress]      NVARCHAR (MAX) NULL,
    [HasPortalAccess]       BIT            NULL,
    [ImageUrl]              VARCHAR (200)  NOT NULL,
    [Notes]                 VARCHAR (1000) NULL,
    [SignatureOnFile]       BIT            NULL,
    [InsuranceCompany]      VARCHAR (1000) NULL,
    [SignatureUrl]          VARCHAR (300)  NULL,
    [HasOrgAccess]          BIT            DEFAULT (NULL) NULL,
    [UserId]                INT            DEFAULT (NULL) NULL,
    [AssignedRoleId]        INT            DEFAULT (NULL) NULL,
    CONSTRAINT [PK_OrgMemberInfo] PRIMARY KEY CLUSTERED ([OrgMemberId] ASC)
);

