CREATE PROCEDURE [dbo].[usp_cmsSaveGroupSessionRecordings] (
    @SessionRecordingId int = 0
    , @SessionId int = 0
    , @ArchiveId nvarchar(MAX) = ''
	, @SessionKey nvarchar(MAX) = ''
	, @AppointmentId int = 0
	, @OrganizationId int = 0
    , @UserId INT = 0
    , @IpAddress NVARCHAR(500) = ''
    , @Action NVARCHAR(5) = 'A'
    )
AS
BEGIN
    SET	@SessionKey = ISNULL(LTRIM(RTRIM(@SessionKey)), '');
    SET	@AppointmentId = ISNULL(@AppointmentId, 0);

	IF @SessionKey = '' AND @AppointmentId = 0
		BEGIN
			SELECT	CAST(0 AS BIT) [IsSuccess]
					, 'Session Key or Account id not provided.' [Message]
					, 404 [StatusCode]
					, -1 [Data];
			RETURN;
		END

	IF @SessionKey <> ''
		BEGIN
			SELECT	@SessionId = gs.[SessionId]
			FROM	[cms].[GroupSessions] gs
			WHERE	gs.[SessionKey] = @SessionKey
					AND gs.[OrganizationId] = @OrganizationId
					AND gs.[IsActive] = 1
					AND gs.[IsDeleted] = 0;
		END

	IF @AppointmentId > 0
		BEGIN
			SELECT	@SessionId = gs.[SessionId]
			FROM	[cms].[GroupSessions] gs
					JOIN [cms].[GroupSessionInvitations] gsi
						ON gs.[SessionId] = gsi.[SessionId]
						AND gsi.[OrganizationId] = @OrganizationId
						AND gsi.[AppointmentId] = @AppointmentId
						AND gsi.[IsActive] = 1
						AND gsi.[IsDeleted] = 0
			WHERE	gs.[OrganizationId] = @OrganizationId
					AND gs.[IsActive] = 1
					AND gs.[IsDeleted] = 0;
		END

	IF @SessionId = 0
		BEGIN
			SELECT	CAST(0 AS BIT) [IsSuccess]
					, 'Session not found.' [Message]
					, 404 [StatusCode]
					, -1 [Data];
			RETURN;
		END

	INSERT INTO [cms].[GroupSessionRecordings] (
        [SessionId]
        , [ArchiveId]
        , [CreatedBy]
        , [CreatedOn]
        , [CreatedIpAddress]
        , [IsActive]
        , [IsDeleted]
        )
    SELECT @SessionId [SessionId]
        , @ArchiveId [ArchiveId]
        , @UserId [CreatedBy]
        , GETUTCDATE() [CreatedOn]
        , @IpAddress [CreatedIpAddress]
        , 1 [IsActive]
        , 0 [IsDeleted];

    SELECT @SessionRecordingId = SCOPE_IDENTITY();

    SELECT CAST(1 AS BIT) [IsSuccess]
        , 'Group Session Recordings saved successfully.' [Message]
        , 200 [StatusCode]
        , @SessionRecordingId [Data];
END