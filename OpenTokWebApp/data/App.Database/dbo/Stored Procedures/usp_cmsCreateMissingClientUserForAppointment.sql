CREATE PROCEDURE [dbo].[usp_cmsCreateMissingClientUserForAppointment]
(
	@AppointmentId INT = 0
	, @OrganizationId INT = 0
	, @LoggedInUserId INT = 0
	, @IpAddress NVARCHAR(MAX) = ''
)
AS
BEGIN
	DECLARE @PatientRoleId int = 0;

	DECLARE @ClientUserId int = 0;
	DECLARE @ClientId int = 0;

	SELECT @PatientRoleId = [RoleId]
	FROM [org].[Roles]
	WHERE [CodeKey] = 'Patient';

	SELECT	TOP 1 @ClientUserId = ISNULL(u.[UserId], 0)
			, @ClientId = ISNULL(ca.[ClientId], 0)
	FROM	[pat].[ClientInfo] ci1
			JOIN [pat].[ClientAppointments] ca
				ON ca.[ClientId] = ci1.[ClientId]
				AND ca.[IsActive] = 1
				AND ca.[IsDeleted] = 0
			LEFT JOIN [org].[User] u
				ON ci1.[UserId] = u.[UserId]
				AND u.[OrganizationId] = @OrganizationId
				AND u.[IsActive] = 1
				AND u.[IsDeleted] = 0
	WHERE	ca.[AppointmentId] = @AppointmentId
			AND ca.[OrganizationId] = @OrganizationId
			AND ci1.[OrganizationId] = @OrganizationId
			AND ci1.[IsActive] = 1
			AND ci1.[IsDeleted] = 0

	IF ISNULL(@ClientUserId, 0) = 0
		BEGIN
			DECLARE @clientEmail NVARCHAR(MAX) = '';

			SELECT	TOP 1 @clientEmail = LOWER([dbo].[udf_DecryptText](ci.[Guid], ci.[EmailId]))
			FROM	[pat].[ClientInfo] ci
			WHERE	ci.[ClientId] = @ClientId
					AND ci.[OrganizationId] = @OrganizationId
					AND ci.[IsActive] = 1
					AND ci.[IsDeleted] = 0;

			SELECT @ClientUserId = u.[UserId]
			FROM	[org].[User] u
			WHERE	u.[Email] = @clientEmail
					AND u.[RoleId] = @PatientRoleId
					AND u.[OrganizationId] = @OrganizationId
					AND u.[IsActive] = 1
					AND u.[IsDeleted] = 0;

			UPDATE	ci
			SET		ci.[UserId] = @ClientUserId
					, ci.[LastModifiedBy] = @LoggedInUserId
					, ci.[LastModifiedOn] = GETUTCDATE()
					, ci.[LastModifiedIpAddress] = @IpAddress
			FROM	[pat].[ClientInfo] ci
			WHERE	ci.[ClientId] = @ClientId
					AND @ClientUserId > 0;
		END
	
	DECLARE @userGuid uniqueidentifier = NEWID();

	IF ISNULL(@ClientUserId, 0) = 0
		BEGIN
			INSERT INTO [org].[User]
			(
				[FirstName]
				, [LastName]
				, [Email]
				, [Password]
				, [MobileNo]
				, [RoleId]
				, [UserTimeZone]
				, [IsActive]
				, [IsDeleted]
				, [CreatedBy]
				, [CreatedOn]
				, [Guid]
				, [OrganizationId]
				, [CreatedIpAddress]
			)
			SELECT	[dbo].[udf_DecryptText](ci.[Guid], ci.[FirstName]) [FirstName]
					, [dbo].[udf_DecryptText](ci.[Guid], ci.[LastName]) [LastName]
					, LOWER([dbo].[udf_DecryptText](ci.[Guid], ci.[EmailId])) [Email]
					, [dbo].[udf_EncryptText](@userGuid, [dbo].[udf_DecryptText](ci.[Guid], ci.[FirstName])
						+'@'+ CAST(YEAR(GETDATE()) AS NVARCHAR) +'#') [Password]
					, ISNULL(cci.[MobileNo], '') [MobileNo]
					, @PatientRoleId [RoleId]
					, 'PST' [UserTimeZone]
					, 1 [IsActive]
					, 0 [IsDeleted]
					, @LoggedInUserId [CreatedBy]
					, GETUTCDATE() [CreatedOn]
					, @userGuid [Guid]
					, @OrganizationId [OrganizationId]
					, @IpAddress [CreatedIpAddress]
			FROM	[pat].[ClientInfo] ci
					OUTER APPLY
					(
						SELECT	TOP 1 [dbo].[udf_DecryptText](x.[Guid], x.[Phone]) [MobileNo]
						FROM	[pat].[ClientContactInfo] x
						WHERE	x.[ClientId] = ci.[ClientId]
								AND x.[IsActive] = 1
								AND x.[IsDeleted] = 0
						ORDER BY x.[PreferenceId], x.[ClientContactInfoId]
					) cci
			WHERE	ci.[ClientId] = @ClientId
					AND ci.[OrganizationId] = @OrganizationId
					AND ci.[IsActive] = 1
					AND ci.[IsDeleted] = 0;

			SELECT @ClientUserId = SCOPE_IDENTITY();

			UPDATE	ci
			SET		ci.[UserId] = @ClientUserId
					, ci.[LastModifiedBy] = @LoggedInUserId
					, ci.[LastModifiedOn] = GETUTCDATE()
					, ci.[LastModifiedIpAddress] = @IpAddress
			FROM	[pat].[ClientInfo] ci
			WHERE	ci.[ClientId] = @ClientId;
		END

	SELECT	CAST(1 AS BIT) [IsSuccess]
			, 'Created' [Message]
			, 200 [StatusCode]
			, @ClientUserId [Data]
			, @ClientId [ClientId];
END