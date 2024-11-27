CREATE PROCEDURE [dbo].[usp_cmsGetUsersForInvitation]
(
	@OrganizationId int = 1
	, @AppointmentId int = 668
	, @SearchTerm nvarchar(MAX) = ''
)
AS
BEGIN
	SELECT	TOP 100
			u.[UserId]
			, ISNULL(NULLIF(RTRIM(LTRIM(u.[FirstName] 
				+ ' ' + u.[LastName])), ''), 'NA') [UserFullName]
			, u.[Email]
			, ISNULL(r.[RoleName], 'NA') [RoleName]
	FROM	[org].[User] u
			LEFT JOIN [org].[Roles] r
				ON u.[RoleId] = r.[RoleId]
				AND r.[IsActive] = 1
				AND r.[IsDeleted] = 0
	WHERE	ISNULL(NULLIF(RTRIM(LTRIM(u.[FirstName] + ' ' + u.[LastName])), ''), 'NA')
				<> 'NA'
			AND u.[OrganizationId] = @OrganizationId
			AND u.[IsActive] = 1
			AND u.[IsDeleted] = 0
			AND NOT EXISTS(
				SELECT	TOP 1 1
				FROM	[cms].[GroupSessionInvitations] gsi
				WHERE	gsi.[OrganizationId] = @OrganizationId
						AND gsi.[IsActive] = 1
						AND gsi.[IsDeleted] = 0
						AND gsi.[AppointmentId] = @AppointmentId
						AND u.[UserId] = gsi.[UserId]
			)
			AND
			(
				@SearchTerm = ''
				OR u.[FirstName] LIKE '%' + @SearchTerm + '%'
				OR u.[LastName] LIKE '%' + @SearchTerm + '%'
				OR u.[Email] LIKE '%' + @SearchTerm + '%'
			)
	ORDER BY u.[FirstName] + ' ' + u.[LastName]
			, u.[Email]
END