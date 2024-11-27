CREATE TABLE [cms].[GroupSessionRecordings] (
    [SessionRecordingId]    INT            IDENTITY (1, 1) NOT NULL,
    [SessionId]             INT            NOT NULL,
    [ArchiveId]             NVARCHAR (MAX) NOT NULL,
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
    CONSTRAINT [PK_GroupSessionRecordings] PRIMARY KEY CLUSTERED ([SessionRecordingId] ASC),
    CONSTRAINT [FK_GroupSessionRecordings_GroupSessions_SessionId] FOREIGN KEY ([SessionId]) REFERENCES [cms].[GroupSessions] ([SessionId])
);

