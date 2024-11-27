CREATE FUNCTION [dbo].[udf_IsDayLightSavingTime] (@date_time DATETIME2)
RETURNS BIT
BEGIN
    DECLARE @year INT = DatePart(YEAR, @date_time)
    DECLARE @StartOfMarch DATETIME
        , @StartOfNovember DATETIME
        , @dayLightSavingTimeStart DATETIME
        , @dayLightSavingTimeEnd DATETIME

    SET @StartOfMarch = DATEADD(MONTH, 2, DATEADD(YEAR, @year - 1900, 0))
    SET @StartOfNovember = DATEADD(MONTH, 10, DATEADD(YEAR, @year - 1900, 0));
    SET @dayLightSavingTimeStart = DATEADD(HOUR, 2, DATEADD(day, ((15 - DATEPART(dw, @StartOfMarch)) % 7), @StartOfMarch))
    SET @dayLightSavingTimeEnd = DATEADD(HOUR, 2, DATEADD(day, ((8 - DATEPART(dw, @StartOfNovember)) % 7), @StartOfNovember))

    RETURN CASE 
            WHEN @date_time BETWEEN @dayLightSavingTimeStart
                    AND @dayLightSavingTimeEnd
                THEN 1
            ELSE 0
            END
END