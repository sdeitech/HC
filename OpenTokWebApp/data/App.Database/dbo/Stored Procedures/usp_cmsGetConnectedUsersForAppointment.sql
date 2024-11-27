CREATE PROCEDURE [dbo].[usp_cmsGetConnectedUsersForAppointment] (
    @AppointmentId int = 0
	, @OrganizationId int = 0
	, @CallerId int = 0
    )
AS
BEGIN
	DECLARE @CallerName NVARCHAR(MAX) = '';
	DECLARE @CallerRoleName NVARCHAR(MAX) = '';

	SELECT	@CallerName = ISNULL(NULLIF(RTRIM(LTRIM(ISNULL([dbo].[udf_DecryptText](u.[Guid], u.[FirstName]), u.[FirstName])
				+ ' ' + ISNULL([dbo].[udf_DecryptText](u.[Guid], u.[LastName]), u.[LastName]))), ''), 'NA')
			, @CallerRoleName = ISNULL(r.[RoleName], 'NA')
	FROM	[org].[User] u
			LEFT JOIN [org].[Roles] r
				ON u.[RoleId] = r.[RoleId]
				AND r.[IsActive] = 1
				AND r.[IsDeleted] = 0
	WHERE	u.[UserId] = @CallerId
			AND u.[IsActive] = 1
			AND u.[IsDeleted] = 0
			AND u.[OrganizationId] = @OrganizationId;

	SELECT	t.[ConnectionId]
			, t.[UserId]
			, t.[DeviceId]
			, ISNULL(NULLIF(RTRIM(LTRIM(ISNULL([dbo].[udf_DecryptText](u.[Guid], u.[FirstName]), u.[FirstName])
				+ ' ' + ISNULL([dbo].[udf_DecryptText](u.[Guid], u.[LastName]), u.[LastName]))), ''), 'NA') [FullName]
			, r.[RoleName]
			, @CallerName [CallerName]
			, @CallerRoleName [CallerRoleName]
			, CAST(gsi.[InvitaionId] AS NVARCHAR(MAX)) [InvitaionId]
	FROM	[cms].[ChatConnectedUser] t
			JOIN [cms].[GroupSessionInvitations] gsi
				ON	t.[UserId] = gsi.[UserId]
				AND gsi.[AppointmentId] = @AppointmentId
				AND gsi.[IsActive] = 1
				AND gsi.[IsDeleted] = 0
				AND gsi.[OrganizationId] = @OrganizationId
			JOIN [org].[User] u
				ON t.[UserId] = u.[UserId]
				AND u.[IsActive] = 1
				AND u.[IsDeleted] = 0
				AND u.[OrganizationId] = @OrganizationId
			LEFT JOIN [org].[Roles] r
				ON u.[RoleId] = r.[RoleId]
				AND r.[IsActive] = 1
				AND r.[IsDeleted] = 0
	WHERE	t.[IsActive] = 1
			AND t.[IsDeleted] = 0;
END