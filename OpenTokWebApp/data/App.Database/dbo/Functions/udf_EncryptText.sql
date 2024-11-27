/*
-------------------------------------------------------------------------
 --Author		- smart data
 --Description	- Text Decryption
-------------------------------------------------------------------------
*/
CREATE   FUNCTION [dbo].[udf_EncryptText](@cryptoKey NVARCHAR(500), @textToEncrypt NVARCHAR(MAX))
RETURNS VARCHAR(MAX)
AS
BEGIN
	DECLARE @encryptedData VARBINARY(MAX) = ENCRYPTBYPASSPHRASE(@cryptoKey, @textToEncrypt);
	DECLARE @base64String VARCHAR(MAX);
	SELECT @base64String = (select @encryptedData as '*' for xml path(''));
	RETURN (@base64String)
END