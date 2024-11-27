CREATE PROCEDURE [dbo].[usp_cmsGetChatConnectedUserList] (
    @PageNumber INT = 1
    , @PageSize INT = 10
    , @SortColumn VARCHAR(50) = ''
    , @SortOrder VARCHAR(5) = ''
    , @SearchText VARCHAR(5) = ''
    )
AS
BEGIN
    SET @SearchText = ISNULL(RTRIM(LTRIM(@SearchText)), '');
    SET @SortColumn = ISNULL(NULLIF(@SortColumn, ''), 'ConnectionId');
    SET @SortOrder = ISNULL(NULLIF(@SortOrder, ''), 'ASC');

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
        , COUNT(CASE 
                WHEN ISNULL(t.[IsActive], 1) = 1
                    AND ISNULL(t.[IsDeleted], 0) = 0
                    THEN 1
                ELSE NULL
                END) OVER () AS [TotalRecords]
    FROM [cms].[ChatConnectedUser] t
    WHERE ISNULL(t.[IsActive], 1) = 1
        AND ISNULL(t.[IsDeleted], 0) = 0
        AND (
            @SearchText = ''
            OR (
                @SearchText <> ''
                AND (
                    t.[Id] LIKE '%' + @SearchText + '%'
                    OR t.[ConnectionId] LIKE '%' + @SearchText + '%'
                    OR t.[UserId] LIKE '%' + @SearchText + '%'
                    )
                )
            )
    ORDER BY (
            CASE 
                WHEN @SortColumn = 'Id'
                    AND @SortOrder = 'ASC'
                    THEN t.[Id]
                END
            ) ASC
        , (
            CASE 
                WHEN @SortColumn = 'Id'
                    AND @SortOrder = 'DESC'
                    THEN t.[Id]
                END
            ) DESC
        , (
            CASE 
                WHEN @SortColumn = 'ConnectionId'
                    AND @SortOrder = 'ASC'
                    THEN t.[ConnectionId]
                END
            ) ASC
        , (
            CASE 
                WHEN @SortColumn = 'ConnectionId'
                    AND @SortOrder = 'DESC'
                    THEN t.[ConnectionId]
                END
            ) DESC
        , (
            CASE 
                WHEN @SortColumn = 'UserId'
                    AND @SortOrder = 'ASC'
                    THEN t.[UserId]
                END
            ) ASC
        , (
            CASE 
                WHEN @SortColumn = 'UserId'
                    AND @SortOrder = 'DESC'
                    THEN t.[UserId]
                END
            ) DESC OFFSET @PageSize * (@PageNumber - 1) ROWS

    FETCH NEXT @PageSize ROWS ONLY;
END