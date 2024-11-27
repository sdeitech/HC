CREATE PROCEDURE [dbo].[usp_cmsGetAppointmentAndSessionDetails]
(
	@AppointmentId INT = 0
	, @OrganizationId INT = 0
)
AS
BEGIN
	SELECT	ca.*
			, ci.[UserId] [ClientUserId]
			, au.[UserId] [AppointmentUserId]
			, ci.[FullName] [ClientName]
			, au.[FullName] [ProviderName]
			, [dbo].[udf_DateTimeWithTimezone](ca.[StartTime], 'PST') [AppointmentDateTime]
			, ISNULL(NULLIF(LTRIM(omci.[PhoneNumber]), ''), '-') [ProviderPhone]
			, ISNULL(NULLIF(LTRIM(omci.[PersonalEmail]), ''), '-') [ProviderEmail]
	FROM	[pat].[ClientAppointments] ca
			OUTER APPLY
			(
				SELECT	TOP 1 ci1.[UserId]
						, ISNULL([dbo].[udf_DecryptText](ci1.[Guid], ci1.[FirstName]), ci1.[FirstName])
							+ ' '
							+ ISNULL([dbo].[udf_DecryptText](ci1.[Guid], ci1.[LastName]), ci1.[LastName]) [FullName]
				FROM	[pat].[ClientInfo] ci1
				WHERE	ca.[ClientId] = ci1.[ClientId]
						AND ci1.[OrganizationId] = @OrganizationId
						AND ci1.[IsActive] = 1
						AND ci1.[IsDeleted] = 0
			) ci
			OUTER APPLY
			(
				SELECT	omi.[UserId]
						, omi.[FirstName] + ' ' + omi.[LastName] [FullName]
				FROM	[org].[OrgMemberInfo] omi
				WHERE	ca.[OrgMemberId] = omi.[OrgMemberId]
						AND omi.[OrganizationId] = @OrganizationId
						AND omi.[IsActive] = 1
						AND omi.[IsDeleted] = 0
			) au
			OUTER APPLY
			(
				SELECT	TOP 1 omci1.[PhoneNumber]
						, omci1.[PersonalEmail]
				FROM	[org].[OrgMemberContactInfo] omci1
				WHERE	omci1.[OrgMemberId] = ca.[OrgMemberId]
						AND ca.[IsActive] = 1
						AND ca.[IsDeleted] = 0
			) omci
	WHERE	ca.[AppointmentId] = @AppointmentId
			AND ca.[OrganizationId] = @OrganizationId
			AND ca.[IsActive] = 1
			AND ca.[IsDeleted] = 0;

	SELECT	gs.*
			, COUNT(1) OVER () [TotalRecords]
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

	SELECT	gsi.*
			, COUNT(1) OVER () [TotalRecords]
	FROM	[cms].[GroupSessionInvitations] gsi
	WHERE	gsi.[OrganizationId] = @OrganizationId
			AND gsi.[AppointmentId] = @AppointmentId
			AND gsi.[IsActive] = 1
			AND gsi.[IsDeleted] = 0;

	SELECT	gst.*
			, COUNT(1) OVER () [TotalRecords]
	FROM	[cms].[GroupSessionTokens] gst
			JOIN [cms].[GroupSessions] gs
				ON gst.[SessionId] = gs.[SessionId]
				AND gs.[OrganizationId] = @OrganizationId
				AND gs.[IsActive] = 1
				AND gs.[IsDeleted] = 0
			JOIN [cms].[GroupSessionInvitations] gsi
				ON gst.[SessionInvitationId] = gsi.[SessionInvitationId]
				AND	gsi.[OrganizationId] = @OrganizationId
				AND gsi.[AppointmentId] = @AppointmentId
				AND gsi.[IsActive] = 1
				AND gsi.[IsDeleted] = 0
	WHERE	gst.[OrganizationId] = @OrganizationId
			AND gst.[IsActive] = 1
			AND gst.[IsDeleted] = 0;
END