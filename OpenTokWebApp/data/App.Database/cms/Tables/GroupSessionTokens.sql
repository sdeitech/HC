CREATE TABLE [cms].[GroupSessionTokens] (
    [SessionTokenId]        INT            IDENTITY (1, 1) NOT NULL,
    [SessionId]             INT            NOT NULL,
    [SessionInvitationId]   INT            NULL,
    [TokenKey]              NVARCHAR (MAX) NOT NULL,
    [TokenExpiry]           FLOAT (53)     NOT NULL,
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
    CONSTRAINT [PK_GroupSessionTokens] PRIMARY KEY CLUSTERED ([SessionTokenId] ASC),
    CONSTRAINT [FK_GroupSessionTokens_GroupSessionInvitations_SessionInvitationId] FOREIGN KEY ([SessionInvitationId]) REFERENCES [cms].[GroupSessionInvitations] ([SessionInvitationId]),
    CONSTRAINT [FK_GroupSessionTokens_GroupSessions_SessionId] FOREIGN KEY ([SessionId]) REFERENCES [cms].[GroupSessions] ([SessionId])
);

