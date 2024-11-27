CREATE  PROCEDURE [dbo].[usr_GetUserDetails] 
 @email VARCHAR(500) = ''    
 , @is_password BIT = 0  
 , @user_id INT = 0  
AS    
BEGIN    
 SET @email = NULLIF(@email, '');  
 SET @user_id = NULLIF(@user_id, 0);  
  
  SELECT u.[UserId] [id]    
   , u.[FirstName] [first_name]    
   , u.[LastName] [last_name]    
   , u.[email]    
   , CASE WHEN @is_password = 1    
    THEN [dbo].[udf_DecryptText](u.[Guid], u.[password])    
    ELSE '' END [password_hash]    
   , u.[MobileNo] [mobile_no]    
   , u.[UserTimeZone] [user_timezone]    
   , r.[RoleName] [role_name]    
   , u.[OrganizationId]    
   , 'NA' [OrganizationName]   
   , u.[RoleId]  
   ,      
   ISNULL(ISNULL(p.[ClientId], x.[OrgMemberId]), 0) [TransId]  
 FROM [org].[User] u    
   JOIN [org].[Roles] r  
    ON u.[RoleId] = r.[RoleId]    
     AND r.[IsActive] = 1    
     AND r.[IsDeleted] = 0    
   OUTER APPLY  
   (  
    SELECT TOP 1 omi.[OrgMemberId]  
    FROM [org].[OrgMemberInfo] omi  
    WHERE omi.[IsActive] = 1  
     AND omi.[IsDeleted] = 0  
     AND omi.[UserId] = u.[UserId]  
   ) x  
   OUTER APPLY  
   (  
      SELECT TOP 1 cli.[ClientId]  
      FROM [pat].[ClientInfo] cli  
      WHERE cli.[IsActive] = 1  
     AND cli.[IsDeleted] = 0  
     AND cli.[UserId] = u.[UserId]  
   ) p  
 WHERE u.[IsActive] = 1    
  AND u.[IsDeleted] = 0    
  AND ISNULL([dbo].[udf_DecryptText](u.[guid], u.[email]), u.[email])   
   = ISNULL(@email, ISNULL([dbo].[udf_DecryptText](u.[guid], u.[email]), u.[email]))  
  AND u.[UserId] = ISNULL(@user_id, u.[UserId]);  
END