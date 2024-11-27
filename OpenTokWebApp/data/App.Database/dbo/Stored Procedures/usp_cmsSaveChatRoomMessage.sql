CREATE PROCEDURE [dbo].[usp_cmsSaveChatRoomMessage] (
	@AppointmentId int = 0
    , @MessageId int = 0
    , @RoomId int = 0
    , @FromUserId int = 0
    , @RoomMessage nvarchar(MAX) = ''
	, @OrganizationId int = 0
    , @IsMessage bit = 0
    , @IsRecording bit = 0
    , @IsFile bit = 0
    , @FileName nvarchar(MAX) = ''
    , @FileType nvarchar(MAX) = ''
    , @MessageDate datetime2 = null
    , @UserId INT = 0
    , @IpAddress NVARCHAR(500) = ''
    , @Action NVARCHAR(5) = 'A'
    )
AS
BEGIN
	-- Validating appointments
    IF @AppointmentId = 0
    BEGIN
        SELECT CAST(0 AS BIT) [IsSuccess]
            , 'AppointmentId is not valid.' [Message]
            , 500 [StatusCode]
            , - 1 [Data]

        RETURN;
    END

	IF NOT EXISTS (	SELECT	TOP	1 1
					FROM	[cms].[ChatRoom] cr
					WHERE	cr.[IsActive] = 1
							AND cr.[IsDeleted] = 0
							AND cr.[OrganizationId] = @OrganizationId
							AND cr.[AppointmentId] = @AppointmentId
		)
		BEGIN
			INSERT INTO [cms].[ChatRoom]
			(
				[RoomName]
				, [AppointmentId]
				, [OrganizationId]
				, [CreatedBy]
				, [CreatedOn]
				, [CreatedIpAddress]
				, [IsActive]
				, [IsDeleted]
			)
			SELECT	'App-' + CAST(@AppointmentId AS varchar) [RoomName]
					, @AppointmentId [AppointmentId]
					, @OrganizationId [OrganizationId]
					, @UserId [CreatedBy]
					, GETUTCDATE() [CreatedOn]
					, @IpAddress [CreatedIpAddress]
					, 1 [IsActive]
					, 0 [IsDeleted];

			SELECT @RoomId = SCOPE_IDENTITY();
		END

	-- Overriding @RoomId based on @AppointmentId
	SELECT	@RoomId = cr.[ChatRoomId]
	FROM	[cms].[ChatRoom] cr
	WHERE	cr.[IsActive] = 1
			AND cr.[IsDeleted] = 0
			AND cr.[OrganizationId] = @OrganizationId
			AND cr.[AppointmentId] = @AppointmentId;
	
	DECLARE @ClientUserId INT = 0;
	DECLARE @AppointmentUserId INT = 0;
	
	SELECT	@ClientUserId = ISNULL(cl.[ClientUserId], 0)
			, @AppointmentUserId = ISNULL(omi.[AppointmentUserId], 0)
	FROM	[pat].[ClientAppointments] ca
			OUTER APPLY
			(
				SELECT	TOP 1 ci1.[UserId] [ClientUserId]
				FROM	[pat].[ClientInfo] ci1
				WHERE	ca.[ClientId] = ci1.[ClientId]
						AND ci1.[IsActive] = 1
						AND ci1.[IsDeleted] = 0
						AND ci1.[OrganizationId] = @OrganizationId
			) cl
			OUTER APPLY
			(
				SELECT	TOP 1 omi1.[UserId] [AppointmentUserId]
				FROM	[org].[OrgMemberInfo] omi1
				WHERE	ca.[OrgMemberId] = omi1.[OrgMemberId]
						AND omi1.[IsActive] = 1
						AND omi1.[IsDeleted] = 0
						AND omi1.[OrganizationId] = @OrganizationId
			) omi
	WHERE	ca.[IsActive] = 1
			AND ca.[IsDeleted] = 0
			AND ca.[OrganizationId] = @OrganizationId
			AND ca.[AppointmentId] = @AppointmentId;	
	
	
	-- Populating chat users
	INSERT INTO [cms].[ChatRoomUser]
	(
		[RoomId]
		, [ChatUserId]
		, [OrganizationId]
		, [CreatedBy]
		, [CreatedOn]
		, [CreatedIpAddress]
		, [IsActive]
		, [IsDeleted]
	)
	SELECT	@RoomId [RoomId]
			, @FromUserId [ChatUserId]
			, @OrganizationId [OrganizationId]
			, @UserId [CreatedBy]
			, GETUTCDATE() [CreatedOn]
			, @IpAddress [CreatedIpAddress]
			, 1 [IsActive]
			, 0 [IsDeleted]
	WHERE	NOT EXISTS
			(
				SELECT	TOP 1 1
				FROM	[cms].[ChatRoomUser] cru
				WHERE	cru.[RoomId] = @RoomId
						AND cru.[ChatUserId] = @FromUserId
						AND cru.[OrganizationId] = @OrganizationId
						AND cru.[IsActive] = 1
						AND cru.[IsDeleted] = 0
			);

	-- Populating chat users
	INSERT INTO [cms].[ChatRoomUser]
	(
		[RoomId]
		, [ChatUserId]
		, [OrganizationId]
		, [CreatedBy]
		, [CreatedOn]
		, [CreatedIpAddress]
		, [IsActive]
		, [IsDeleted]
	)
	SELECT	@RoomId [RoomId]
			, @ClientUserId [ChatUserId]
			, @OrganizationId [OrganizationId]
			, @UserId [CreatedBy]
			, GETUTCDATE() [CreatedOn]
			, @IpAddress [CreatedIpAddress]
			, 1 [IsActive]
			, 0 [IsDeleted]
	WHERE	@ClientUserId > 0
			AND NOT EXISTS
			(
				SELECT	TOP 1 1
				FROM	[cms].[ChatRoomUser] cru
				WHERE	cru.[RoomId] = @RoomId
						AND cru.[ChatUserId] = @ClientUserId
						AND cru.[OrganizationId] = @OrganizationId
						AND cru.[IsActive] = 1
						AND cru.[IsDeleted] = 0
			);
	
	-- Populating chat users
	INSERT INTO [cms].[ChatRoomUser]
	(
		[RoomId]
		, [ChatUserId]
		, [OrganizationId]
		, [CreatedBy]
		, [CreatedOn]
		, [CreatedIpAddress]
		, [IsActive]
		, [IsDeleted]
	)
	SELECT	@RoomId [RoomId]
			, @AppointmentUserId [ChatUserId]
			, @OrganizationId [OrganizationId]
			, @UserId [CreatedBy]
			, GETUTCDATE() [CreatedOn]
			, @IpAddress [CreatedIpAddress]
			, 1 [IsActive]
			, 0 [IsDeleted]
	WHERE	@AppointmentUserId > 0
			AND NOT EXISTS
			(
				SELECT	TOP 1 1
				FROM	[cms].[ChatRoomUser] cru
				WHERE	cru.[RoomId] = @RoomId
						AND cru.[ChatUserId] = @AppointmentUserId
						AND cru.[OrganizationId] = @OrganizationId
						AND cru.[IsActive] = 1
						AND cru.[IsDeleted] = 0
			);
	
	
	DECLARE @Guid nvarchar(100) = NEWID();
	
	INSERT INTO [cms].[ChatRoomMessage] (
        [RoomId]
        , [FromUserId]
        , [RoomMessage]
		, [OrganizationId]
        , [IsMessage]
        , [IsRecording]
        , [IsFile]
        , [FileName]
        , [FileType]
        , [MessageDate]
        , [CreatedBy]
        , [CreatedOn]
        , [CreatedIpAddress]
        , [IsActive]
        , [IsDeleted]
		, [Guid]
        )
    SELECT @RoomId [RoomId]
        , @FromUserId [FromUserId]
        , [dbo].[udf_EncryptText](@Guid, ISNULL(@RoomMessage, '')) [RoomMessage]
		, @OrganizationId [OrganizationId]
        , @IsMessage [IsMessage]
        , @IsRecording [IsRecording]
        , @IsFile [IsFile]
        , [dbo].[udf_EncryptText](@Guid, ISNULL(@FileName, '')) [FileName]
        , [dbo].[udf_EncryptText](@Guid, ISNULL(@FileType, '')) [FileType]
        , GETUTCDATE() [MessageDate]
        , @UserId [CreatedBy]
        , GETUTCDATE() [CreatedOn]
        , @IpAddress [CreatedIpAddress]
        , 1 [IsActive]
        , 0 [IsDeleted]
		, @Guid [Guid];

    SELECT @MessageId = SCOPE_IDENTITY();

    SELECT CAST(1 AS BIT) [IsSuccess]
        , 'Chat Room Message saved successfully.' [Message]
        , 200 [StatusCode]
        , @MessageId [Data];
END