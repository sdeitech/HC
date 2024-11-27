CREATE PROCEDURE [dbo].[usp_cmsGetAllActiveUserConnections] (
    @UserId int = 0
    )
AS
BEGIN
	SELECT	t.[ConnectionId]
	FROM	[cms].[ChatConnectedUser] t
	WHERE	t.[IsActive] = 1
			AND t.[IsDeleted] = 0
			AND t.[UserId] = @UserId
END