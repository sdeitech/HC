CREATE TABLE [cms].[GroupSessionInvitations] (
    [SessionInvitationId]   INT              IDENTITY (1, 1) NOT NULL,
    [SessionId]             INT              NOT NULL,
    [AppointmentId]         INT              NULL,
    [UserId]                INT              NULL,
    [InvitaionId]           UNIQUEIDENTIFIER NULL,
    [OrganizationId]        INT              NULL,
    [CreatedBy]             INT              NOT NULL,
    [CreatedOn]             DATETIME2 (7)    NOT NULL,
    [CreatedIpAddress]      NVARCHAR (MAX)   NULL,
    [LastModifiedBy]        INT              NULL,
    [LastModifiedOn]        DATETIME2 (7)    NULL,
    [LastModifiedIpAddress] NVARCHAR (MAX)   NULL,
    [IsActive]              BIT              NOT NULL,
    [IsDeleted]             BIT              NOT NULL,
    [DeletedBy]             INT              NULL,
    [DeletedOn]             DATETIME2 (7)    NULL,
    [DeletedIpAddress]      NVARCHAR (MAX)   NULL,
    [ClientId]              INT              NULL,
    CONSTRAINT [PK_GroupSessionInvitations] PRIMARY KEY CLUSTERED ([SessionInvitationId] ASC),
    CONSTRAINT [FK_GroupSessionInvitations_ClientAppointments_AppointmentId] FOREIGN KEY ([AppointmentId]) REFERENCES [pat].[ClientAppointments] ([AppointmentId])
);

