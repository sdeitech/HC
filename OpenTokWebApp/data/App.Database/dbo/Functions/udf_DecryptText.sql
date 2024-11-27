/*
-------------------------------------------------------------------------
 --Author		- smart data
 --Description	- Text Decryption
-------------------------------------------------------------------------
*/
CREATE   FUNCTION [dbo].[udf_DecryptText](@cryptoKey NVARCHAR(100), @base64TextToDecrpt NVARCHAR(MAX))
RETURNS VARCHAR(MAX)
AS
BEGIN
	DECLARE @binaryData VARBINARY(MAX);
	SELECT @binaryData = (SELECT CAST(N'' as xml).value('xs:base64Binary(sql:variable("@base64TextToDecrpt"))', 'varbinary(MAX)'));
	DECLARE @decryptedText NVARCHAR(MAX) = DECRYPTBYPASSPHRASE(@cryptoKey, @binaryData);
	RETURN (@decryptedText);
END