CREATE PROCEDURE [dbo].[usp_cmsSaveGroupSessionInvitations] (
    @SessionInvitationId int = 0
    , @SessionId int = 0
    , @AppointmentId int = 0
    , @InvitaionId uniqueidentifier = null
	, @OrganizationId INT = 0
	, @ClientId INT = 0
    , @UserId INT = 0
	, @LoginUserId INT = 0
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
    SELECT @SessionInvitationId = CASE 
            WHEN @Action = 'A'
                THEN 0
            ELSE ISNULL(@SessionInvitationId, 0)
            END;

    -- In Update/Delete mode checking existance of records
    IF @Action IN (
            'U'
            , 'D'
            )
        AND NOT EXISTS (
            SELECT TOP 1 1
            FROM [cms].[GroupSessionInvitations] t
            WHERE t.[SessionInvitationId] = @SessionInvitationId
                AND t.[IsActive] = 1
                AND t.[IsDeleted] = 0
            )
    BEGIN
        SELECT CAST(0 AS BIT) [IsSuccess]
            , 'Group Session Invitations does not exists.' [Message]
            , 500 [StatusCode]
            , - 1 [Data]

        RETURN;
    END

	SET @ClientId = ISNULL(@ClientId, 0);

	-- Check if invitation is being generated for patient
	IF @ClientId = 0
		BEGIN
			DECLARE @LocalClientId INT = 0;
			DECLARE @AppointmentUserId INT = 0;

			SELECT	@AppointmentUserId = omi.[UserId]
			FROM	[pat].[ClientAppointments] ca
					JOIN [org].[OrgMemberInfo] omi
						ON ca.[OrgMemberId] = omi.[OrgMemberId]
						AND omi.[OrganizationId] = @OrganizationId
						AND omi.[IsActive] = 1
						AND omi.[IsDeleted] = 0
			WHERE	ca.[AppointmentId] = @AppointmentId
					AND ca.[OrganizationId] = @OrganizationId
					AND ca.[IsActive] = 1
					AND ca.[IsDeleted] = 0;

			SELECT	@LocalClientId = ci.[ClientId]
			FROM	[pat].[ClientInfo] ci
			WHERE	ci.[UserId] = @UserId
					AND ci.[OrganizationId] = @OrganizationId
					AND ci.[IsActive] = 1
					AND ci.[IsDeleted] = 0
					AND @AppointmentUserId <> @UserId;

			IF @LocalClientId > 0
				BEGIN
					SET @ClientId = @LocalClientId;
				END
		END

    SET @ClientId = NULLIF(@ClientId, 0);
	
	IF @Action = 'A'
    BEGIN
        INSERT INTO [cms].[GroupSessionInvitations] (
            [SessionId]
            , [AppointmentId]
            , [UserId]
            , [InvitaionId]
			, [OrganizationId]
			, [ClientId]
            , [CreatedBy]
            , [CreatedOn]
            , [CreatedIpAddress]
            , [IsActive]
            , [IsDeleted]
            )
        SELECT @SessionId [SessionId]
            , @AppointmentId [AppointmentId]
            , @UserId [UserId]
			, @InvitaionId [InvitaionId]
            , @OrganizationId [OrganizationId]
			, @ClientId [ClientId]
            , @LoginUserId [CreatedBy]
            , GETUTCDATE() [CreatedOn]
            , @IpAddress [CreatedIpAddress]
            , 1 [IsActive]
            , 0 [IsDeleted];

        SELECT @SessionInvitationId = SCOPE_IDENTITY();

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Group Session Invitations saved successfully.' [Message]
            , 200 [StatusCode]
            , @SessionInvitationId [Data];
    END

    IF @Action = 'U'
    BEGIN
        UPDATE t
        SET t.[SessionId] = @SessionId
            , t.[AppointmentId] = @AppointmentId
            , t.[UserId] = @UserId
            , t.[InvitaionId] = @InvitaionId
            , t.[OrganizationId] = @OrganizationId
			, t.[ClientId] = @ClientId
			, t.[LastModifiedBy] = @LoginUserId
            , t.[LastModifiedOn] = GETUTCDATE()
            , t.[LastModifiedIpAddress] = @IpAddress
        FROM [cms].[GroupSessionInvitations] t
        WHERE t.[IsActive] = 1
            AND t.[IsDeleted] = 0
   AND t.[SessionInvitationId] = @SessionInvitationId;

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Group Session Invitations updated successfully.' [Message]
            , 200 [StatusCode]
            , @SessionInvitationId [Data];
    END

    IF @Action = 'D'
    BEGIN
        UPDATE t
        SET t.[IsActive] = 0
            , t.[IsDeleted] = 1
            , t.[DeletedBy] = @LoginUserId
            , t.[DeletedOn] = GETUTCDATE()
            , t.[DeletedIpAddress] = @IpAddress
        FROM [cms].[GroupSessionInvitations] t
        WHERE t.[IsActive] = 1
            AND t.[IsDeleted] = 0
            AND t.[SessionInvitationId] = @SessionInvitationId;

        SELECT CAST(1 AS BIT) [IsSuccess]
            , 'Group Session Invitations deleted successfully.' [Message]
            , 200 [StatusCode]
            , @SessionInvitationId [Data];
    END
END