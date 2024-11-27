CREATE PROCEDURE [dbo].[usp_cmsSaveGroupSessionTokens] (
    @SessionTokenId int = 0
    , @SessionId int = 0
    , @SessionInvitationId int = 0
    , @TokenKey nvarchar(MAX) = ''
    , @TokenExpiry float = 0
	, @OrganizationId int = 0
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
    SELECT @SessionTokenId = CASE 
            WHEN @Action = 'A'
                THEN 0
            ELSE ISNULL(@SessionTokenId, 0)
            END;

    -- In Update/Delete mode checking existance of records
    IF @Action IN (
            'U'
            , 'D'
            )
        AND NOT EXISTS (
            SELECT TOP 1 1
            FROM [cms].[GroupSessionTokens] t
            WHERE t.[SessionTokenId] = @SessionTokenId
                AND t.[IsActive] = 1
                AND t.[IsDeleted] = 0
            )
    BEGIN
        SELECT CAST(0 AS BIT) [IsSuccess]
            , 'Group Session Tokens does not exists.' [Message]
            , 500 [StatusCode]
            , - 1 [Data]

        RETURN;
    END

    IF @Action = 'A'
    BEGIN
        INSERT INTO [cms].[GroupSessionTokens] (
            [SessionId]
            , [SessionInvitationId]
            , [TokenKey]
            , [TokenExpiry]
			, [OrganizationId]
            , [CreatedBy]
            , [CreatedOn]
            , [CreatedIpAddress]
            , [IsActive]
            , [IsDeleted]
            )
        SELECT @SessionId [SessionId]
            , @SessionInvitationId [SessionInvitationId]
            , @TokenKey [TokenKey]
            , @TokenExpiry [TokenExpiry]
			, @OrganizationId [OrganizationId]
            , @UserId [CreatedBy]
            , GETUTCDATE() [CreatedOn]
            , @IpAddress [CreatedIpAddress]
            , 1 [IsActive]
            , 0 [IsDeleted];

        SELECT @SessionTokenId = SCOPE_IDENTITY();

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Group Session Tokens saved successfully.' [Message]
            , 200 [StatusCode]
            , @SessionTokenId [Data];
    END

    IF @Action = 'U'
    BEGIN
        UPDATE t
        SET t.[SessionId] = @SessionId
            , t.[SessionInvitationId] = @SessionInvitationId
            , t.[TokenKey] = @TokenKey
            , t.[TokenExpiry] = @TokenExpiry
			, t.[OrganizationId] = @OrganizationId
            , t.[LastModifiedBy] = @UserId
            , t.[LastModifiedOn] = GETUTCDATE()
            , t.[LastModifiedIpAddress] = @IpAddress
        FROM [cms].[GroupSessionTokens] t
        WHERE t.[IsActive] = 1
            AND t.[IsDeleted] = 0
            AND t.[SessionTokenId] = @SessionTokenId;

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Group Session Tokens updated successfully.' [Message]
            , 200 [StatusCode]
            , @SessionTokenId [Data];
    END

    IF @Action = 'D'
    BEGIN
        UPDATE t
        SET t.[IsActive] = 0
            , t.[IsDeleted] = 1
            , t.[DeletedBy] = @UserId
            , t.[DeletedOn] = GETUTCDATE()
            , t.[DeletedIpAddress] = @IpAddress
        FROM [cms].[GroupSessionTokens] t
        WHERE t.[IsActive] = 1
            AND t.[IsDeleted] = 0
            AND t.[SessionTokenId] = @SessionTokenId;

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Group Session Tokens deleted successfully.' [Message]
            , 200 [StatusCode]
            , @SessionTokenId [Data];
    END
END