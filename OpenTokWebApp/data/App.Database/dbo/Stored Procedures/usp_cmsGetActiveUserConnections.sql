CREATE PROCEDURE [dbo].[usp_cmsGetActiveUserConnections] (
    @UserId int = 0
	, @DeviceId nvarchar(MAX) = ''
    )
AS
BEGIN
	SELECT	t.[ConnectionId]
	FROM	[cms].[ChatConnectedUser] t
	WHERE	t.[IsActive] = 1
			AND t.[IsDeleted] = 0
			AND t.[UserId] = @UserId
			AND t.[DeviceId] = @DeviceId
END