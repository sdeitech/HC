CREATE PROCEDURE [dbo].[usp_cmsSaveGroupSessions] (
    @SessionId int = 0
    , @SessionKey nvarchar(MAX) = ''
    , @StartTime datetime2 = null
    , @EndTime datetime2 = null
    , @OrganizationId INT = 0
    , @UserId INT = 0
    , @IpAddress NVARCHAR(500) = ''
    , @Action NVARCHAR(5) = 'A'
    )
AS
BEGIN
    -- Validating actions
    IF @Action NOT IN (
            'A'
            , 'U'
            , 'D'
            )
    BEGIN
        SELECT CAST(0 AS BIT) [IsSuccess]
            , 'Invalid operation requested.' [Message]
            , 500 [StatusCode]
            , - 1 [Data]

        RETURN;
    END

    -- In add mode ignoring primary key value
    SELECT @SessionId = CASE 
            WHEN @Action = 'A'
                THEN 0
            ELSE ISNULL(@SessionId, 0)
            END;

    -- In Update/Delete mode checking existance of records
    IF @Action IN (
            'U'
            , 'D'
            )
        AND NOT EXISTS (
            SELECT TOP 1 1
            FROM [cms].[GroupSessions] t
            WHERE t.[SessionId] = @SessionId
                AND t.[IsActive] = 1
                AND t.[IsDeleted] = 0
            )
    BEGIN
        SELECT CAST(0 AS BIT) [IsSuccess]
            , 'Group Sessions does not exists.' [Message]
            , 500 [StatusCode]
            , - 1 [Data]

        RETURN;
    END

    IF @Action = 'A'
    BEGIN
        INSERT INTO [cms].[GroupSessions] (
            [SessionKey]
            , [StartTime]
            , [EndTime]
            , [OrganizationId]
			, [CreatedBy]
            , [CreatedOn]
            , [CreatedIpAddress]
            , [IsActive]
            , [IsDeleted]
            )
        SELECT @SessionKey [SessionKey]
            , @StartTime [StartTime]
            , @EndTime [EndTime]
			, @OrganizationId [OrganizationId]
            , @UserId [CreatedBy]
            , GETUTCDATE() [CreatedOn]
            , @IpAddress [CreatedIpAddress]
            , 1 [IsActive]
            , 0 [IsDeleted];

        SELECT @SessionId = SCOPE_IDENTITY();

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Group Sessions saved successfully.' [Message]
            , 200 [StatusCode]
            , @SessionId [Data];
    END

    IF @Action = 'U'
    BEGIN
        UPDATE t
        SET t.[SessionKey] = @SessionKey
            , t.[StartTime] = @StartTime
            , t.[EndTime] = @EndTime
			, t.[OrganizationId] = @OrganizationId
            , t.[LastModifiedBy] = @UserId
            , t.[LastModifiedOn] = GETUTCDATE()
            , t.[LastModifiedIpAddress] = @IpAddress
        FROM [cms].[GroupSessions] t
        WHERE t.[IsActive] = 1
            AND t.[IsDeleted] = 0
            AND t.[SessionId] = @SessionId;

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Group Sessions updated successfully.' [Message]
            , 200 [StatusCode]
            , @SessionId [Data];
    END

    IF @Action = 'D'
    BEGIN
        UPDATE t
        SET t.[IsActive] = 0
            , t.[IsDeleted] = 1
            , t.[DeletedBy] = @UserId
            , t.[DeletedOn] = GETUTCDATE()
            , t.[DeletedIpAddress] = @IpAddress
        FROM [cms].[GroupSessions] t
        WHERE t.[IsActive] = 1
            AND t.[IsDeleted] = 0
            AND t.[SessionId] = @SessionId;

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Group Sessions deleted successfully.' [Message]
            , 200 [StatusCode]
            , @SessionId [Data];
    END
END