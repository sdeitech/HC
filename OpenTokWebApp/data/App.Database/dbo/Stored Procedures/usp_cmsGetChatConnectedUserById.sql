CREATE PROCEDURE [dbo].[usp_cmsGetChatConnectedUserById] (@Id INT = 0)
AS
BEGIN
    SELECT t.[Id]
        , t.[ConnectionId]
        , t.[UserId]
        , t.[CreatedBy]
        , t.[CreatedOn]
        , t.[CreatedIpAddress]
        , t.[LastModifiedBy]
        , t.[LastModifiedOn]
        , t.[LastModifiedIpAddress]
        , t.[IsActive]
        , t.[IsDeleted]
        , t.[DeletedBy]
        , t.[DeletedOn]
        , t.[DeletedIpAddress]
    FROM [cms].[ChatConnectedUser] t
    WHERE t.[Id] = @Id
        AND ISNULL(t.[IsActive], 1) = 1
        AND ISNULL(t.[IsDeleted], 0) = 0
END