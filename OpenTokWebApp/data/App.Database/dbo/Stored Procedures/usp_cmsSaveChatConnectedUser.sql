CREATE PROCEDURE [dbo].[usp_cmsSaveChatConnectedUser] (
    @ConnectionId nvarchar(MAX) = ''
    , @UserId int = 0
	, @DeviceId nvarchar(MAX) = ''
    , @IpAddress NVARCHAR(500) = ''
    , @Action NVARCHAR(5) = 'A'
    )
AS
BEGIN
	DECLARE @MaxAllowedConnections int = 20;
	DECLARE @tblRecords TABLE
	(
		[Id] int,
		[Idx] int
	);

	INSERT @tblRecords
	SELECT	t.[Id]
			, ((COUNT(1) OVER ()) 
				- (ROW_NUMBER() OVER(ORDER BY ISNULL(t.[LastModifiedOn], t.[CreatedOn])))) 
				- @MaxAllowedConnections [idx]
	FROM	[cms].[ChatConnectedUser] t
	WHERE	t.[UserId] = @UserId;

	DELETE	t
	FROM	@tblRecords t
	WHERE	t.[Idx] < 0;

	-- Making old records as deleted for reuse, assuming these old records are not used.
	UPDATE t
    SET t.[IsActive] = 0
        , t.[IsDeleted] = 1
        , t.[DeletedBy] = @UserId
        , t.[DeletedOn] = GETUTCDATE()
        , t.[DeletedIpAddress] = @IpAddress
    FROM [cms].[ChatConnectedUser] t
			JOIN @tblRecords x
				ON t.[Id] = x.[Id];

	IF @Action IN ('A', 'U')
		AND EXISTS (
			SELECT TOP 1 1
			FROM [cms].[ChatConnectedUser] t
			WHERE	t.[IsActive] = 0
					AND t.[IsDeleted] = 1
					AND t.[UserId] = @UserId
		)
    BEGIN
		DECLARE @id int = 0;

		SELECT TOP 1 @id = t.[Id]
		FROM [cms].[ChatConnectedUser] t
		WHERE	t.[IsActive] = 0
				AND t.[IsDeleted] = 1
				AND t.[UserId] = @UserId;

        UPDATE t
        SET t.[ConnectionId] = @ConnectionId
			, t.[DeviceId] = @DeviceId
			, t.[UserId] = @UserId
			, t.[IsActive] = 1
			, t.[IsDeleted] = 0
            , t.[LastModifiedBy] = @UserId
            , t.[LastModifiedOn] = GETUTCDATE()
            , t.[LastModifiedIpAddress] = @IpAddress
        FROM [cms].[ChatConnectedUser] t
        WHERE t.[Id] = @id;

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Chat Connected User updated successfully.' [Message]
            , 200 [StatusCode]
            , 0 [Data];

		RETURN;
    END

    IF @Action IN ('A', 'U')
		AND NOT EXISTS (
			SELECT TOP 1 1
			FROM [cms].[ChatConnectedUser] t
			WHERE	t.[IsActive] = 1
					AND t.[IsDeleted] = 0
					AND t.[UserId] = @UserId
					AND t.[ConnectionId] = @ConnectionId
					AND t.[DeviceId] = @DeviceId
		)
    BEGIN
        INSERT INTO [cms].[ChatConnectedUser] (
            [ConnectionId]
            , [UserId]
			, [DeviceId]
            , [CreatedBy]
            , [CreatedOn]
            , [CreatedIpAddress]
            , [IsActive]
            , [IsDeleted]
            )
        SELECT @ConnectionId [ConnectionId]
            , @UserId [UserId]
			, @DeviceId [DeviceId]
            , @UserId [CreatedBy]
            , GETUTCDATE() [CreatedOn]
            , @IpAddress [CreatedIpAddress]
            , 1 [IsActive]
            , 0 [IsDeleted];

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Chat Connected User saved successfully.' [Message]
            , 200 [StatusCode]
            , 0 [Data];

		RETURN;
    END

    IF @Action IN ('A', 'U')
		AND EXISTS (
			SELECT TOP 1 1
			FROM [cms].[ChatConnectedUser] t
			WHERE	t.[IsActive] = 1
					AND t.[IsDeleted] = 0
					AND t.[UserId] = @UserId
					AND t.[ConnectionId] = @ConnectionId
					AND t.[DeviceId] = @DeviceId
		)
    BEGIN
        UPDATE t
        SET t.[ConnectionId] = @ConnectionId
            , t.[LastModifiedBy] = @UserId
            , t.[LastModifiedOn] = GETUTCDATE()
            , t.[LastModifiedIpAddress] = @IpAddress
        FROM [cms].[ChatConnectedUser] t
        WHERE t.[IsActive] = 1
            AND t.[IsDeleted] = 0
			AND t.[UserId] = @UserId
			AND t.[DeviceId] = @DeviceId;

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Chat Connected User updated successfully.' [Message]
            , 200 [StatusCode]
            , 0 [Data];

		RETURN;
    END

    IF @Action = 'D'
    BEGIN
		DECLARE @DateBefore7Days DATETIME2 = DATEADD(DD, -7, GETUTCDATE());

        UPDATE t
        SET t.[IsActive] = 0
            , t.[IsDeleted] = 1
            , t.[DeletedBy] = @UserId
            , t.[DeletedOn] = GETUTCDATE()
            , t.[DeletedIpAddress] = @IpAddress
        FROM [cms].[ChatConnectedUser] t
        WHERE t.[IsActive] = 1
            AND t.[IsDeleted] = 0
			AND t.[UserId] = @UserId
			AND (t.[DeviceId] = @DeviceId OR t.[CreatedOn] <= @DateBefore7Days);

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Chat Connected User deleted successfully.' [Message]
            , 200 [StatusCode]
            , 0 [Data];

		RETURN;
    END

	SELECT CAST(0 AS BIT) [IsSuccess]
            , 'Bad request.' [Message]
            , 404 [StatusCode]
            , 0 [Data];
END