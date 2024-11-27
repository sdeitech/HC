CREATE PROCEDURE [dbo].[usp_cmsGetChatRoomMessages]
(
	@LoggedInUserId INT = 1
	, @AppointmentId INT = 668
	, @OrganizationId INT = 1
)
AS
BEGIN
	DECLARE @TimeZone NVARCHAR(10) = 'PST';

	SELECT	@TimeZone = ISNULL(NULLIF(LTRIM(RTRIM(u.[UserTimeZone])), ''), 'PST')
	FROM	[org].[User] u
	WHERE	u.[UserId] = @LoggedInUserId;

	SELECT TOP	500 
				t.[FromUserId]
				, u.[FirstName] + ' ' + u.[LastName] [FromUserName]
				, [dbo].[udf_DecryptText](t.[Guid], t.[RoomMessage]) [RoomMessage]
				, t.[IsMessage]
				, t.[IsRecording]
				, t.[IsFile]
				, [dbo].[udf_DecryptText](t.[Guid], t.[FileName]) [FileName]
				, [dbo].[udf_DecryptText](t.[Guid], t.[FileType]) [FileType]
				, [dbo].[udf_DateTimeWithTimezone](t.[MessageDate], @TimeZone) [MessageDate]
				, COUNT(1) OVER() [TotalRecords]
	FROM	[cms].[ChatRoomMessage] t
			JOIN [cms].[ChatRoom] cr
				ON t.[RoomId] = cr.[ChatRoomId]
				AND cr.[IsActive] = 1
				AND cr.[IsDeleted] = 0
				AND cr.[AppointmentId] = @AppointmentId
				AND cr.[OrganizationId] = @OrganizationId
			LEFT JOIN [org].[User] u
				ON t.[FromUserId] = u.[UserId]
				AND u.[IsActive] = 1
				AND u.[IsDeleted] = 0
				AND u.[OrganizationId] = @OrganizationId
	WHERE	t.[IsActive] = 1
			AND t.[IsDeleted] = 0
			AND t.[OrganizationId] = @OrganizationId
	ORDER BY t.[MessageDate] ASC
END