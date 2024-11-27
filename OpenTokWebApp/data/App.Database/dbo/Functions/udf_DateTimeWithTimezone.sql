CREATE   FUNCTION [dbo].[udf_DateTimeWithTimezone] (
    @date_time DATETIME2
    , @conversion_type CHAR(3) = NULL
    )
RETURNS DATETIME

BEGIN
    DECLARE @StandardTimeOffset DECIMAL = -480.00;
    DECLARE @DayLightSavingTimeOffset DECIMAL = -420.00;

	SELECT @conversion_type = ISNULL(NULLIF(@conversion_type, ''), 'PST');

	SELECT	@StandardTimeOffset = x.[StandardTimeOffset]
			, @DayLightSavingTimeOffset = x.[DayLightSavingTimeOffset]
	FROM	[mst].[MasterTimeZone] x
	WHERE	x.[ShortName] = @conversion_type;

    RETURN CASE 
            WHEN [dbo].[udf_IsDayLightSavingTime](DATEADD(MINUTE, @DayLightSavingTimeOffset, CAST(@date_time AS DATETIME))) = 1
                THEN DATEADD(MINUTE, @DayLightSavingTimeOffset, DATEADD(mi, DATEDIFF(mi, 0, cast(@date_time AS DATETIME)), 0))
            ELSE  DATEADD(MINUTE, @StandardTimeOffset, DATEADD(mi, DATEDIFF(mi, 0, cast(@date_time AS DATETIME)), 0))
            END
END