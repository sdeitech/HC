CREATE   PROCEDURE [dbo].[usp_cmsGetSessionDetailsByInvitationId]
(
	@invitaionId uniqueidentifier = null,
	@organizationId INT = 0
)
AS
BEGIN
	SELECT	'' [ApiKey]
			, '' [ApiSecret]
			, gs.[SessionKey] [SessionId]
			, gst.[TokenKey] [Token]
			, gst.[TokenExpiry] [TokenExpiry]
			, gst.[SessionTokenId] [SessionTokenId]
			, ISNULL(gs.[SessionId], 0) [Id]
			, ISNULL(gsi.[AppointmentId], 0) [AppointmentId]
			, ISNULL(ISNULL(ci.[UserId], gsi.[UserId]), 0) [UserId]
			, ISNULL(ci.[Name], u.[Name]) [Name]
			, ISNULL(ci.[Email], u.[Email]) [Email]
			, ISNULL(gsi.[SessionInvitationId], 0) [SessionInvitationId]
	FROM	[cms].[GroupSessionInvitations] gsi
			JOIN [cms].[GroupSessions] gs
				ON gsi.[SessionId] = gs.[SessionId]
				AND gs.[OrganizationId] = @organizationId
				AND gs.[IsDeleted] = 0
				AND gs.[IsActive] = 1
			LEFT JOIN [cms].[GroupSessionTokens] gst
				ON gsi.[SessionInvitationId] = gst.[SessionInvitationId]
				AND gst.[OrganizationId] = @organizationId
				AND gst.[IsDeleted] = 0
				AND gst.[IsActive] = 1
			OUTER APPLY
			(
				SELECT	TOP 1 
						RTRIM(LTRIM(ISNULL([dbo].[udf_DecryptText](u1.[Guid], u1.[FirstName]), u1.[FirstName])
						+ ' ' + ISNULL([dbo].[udf_DecryptText](u1.[Guid], u1.[LastName]), u1.[LastName]))) [Name]
						, RTRIM(LTRIM(ISNULL([dbo].[udf_DecryptText](u1.[Guid], u1.[Email]), u1.[Email]))) [Email]
				FROM	[org].[User] u1
				WHERE	gsi.[UserId] = u1.[UserId]
						AND u1.[OrganizationId] = @organizationId
						AND u1.[IsDeleted] = 0
						AND u1.[IsActive] = 1
			) u
			OUTER APPLY
			(
				SELECT	TOP 1 
						RTRIM(LTRIM(ISNULL([dbo].[udf_DecryptText](ci1.[Guid], ci1.[FirstName]), ci1.[FirstName])
							+ ' ' + ISNULL([dbo].[udf_DecryptText](ci1.[Guid], ci1.[LastName]), ci1.[LastName]))) [Name]
							, RTRIM(LTRIM(ISNULL([dbo].[udf_DecryptText](ci1.[Guid], ci1.[EmailId]), ci1.[EmailId]))) [Email]
						, ci1.[UserId] [UserId]
				FROM	[pat].[ClientInfo] ci1
				WHERE	gsi.[ClientId] = ci1.[ClientId]
						AND ci1.[OrganizationId] = @organizationId
						AND ci1.[IsActive] = 1
						AND ci1.[IsDeleted] = 0
			) ci
	WHERE	gsi.[InvitaionId] = @invitaionId
			AND gsi.[OrganizationId] = @organizationId
			AND gsi.[IsDeleted] = 0
			AND gsi.[IsActive] = 1;
END