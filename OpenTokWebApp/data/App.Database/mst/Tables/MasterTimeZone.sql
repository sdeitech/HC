CREATE TABLE [mst].[MasterTimeZone] (
    [TimeZoneId]               INT            IDENTITY (1, 1) NOT NULL,
    [FullName]                 NVARCHAR (500) NOT NULL,
    [ShortName]                NVARCHAR (500) NOT NULL,
    [StandardTimeOffset]       DECIMAL (18)   NOT NULL,
    [DayLightSavingTimeOffset] DECIMAL (18)   NOT NULL,
    [CreatedBy]                INT            CONSTRAINT [df_mst_MasterTimeZone_CreatedBy] DEFAULT ((0)) NOT NULL,
    [CreatedOn]                DATETIME2 (7)  CONSTRAINT [df_mst_MasterTimeZone_CreatedOn] DEFAULT (getutcdate()) NOT NULL,
    [CreatedIpAddress]         NVARCHAR (1)   NULL,
    [LastModifiedBy]           INT            NULL,
    [LastModifiedOn]           DATETIME2 (7)  NULL,
    [LastModifiedIpAddress]    NVARCHAR (1)   NULL,
    [IsActive]                 BIT            CONSTRAINT [df_mst_MasterTimeZone_IsActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]                BIT            CONSTRAINT [df_mst_MasterTimeZone_IsDeleted] DEFAULT ((0)) NOT NULL,
    [DeletedBy]                INT            NULL,
    [DeletedOn]                DATETIME2 (7)  NULL,
    [DeletedIpAddress]         NVARCHAR (1)   NULL,
    PRIMARY KEY CLUSTERED ([TimeZoneId] ASC)
);

