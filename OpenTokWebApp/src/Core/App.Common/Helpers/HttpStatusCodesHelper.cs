using App.Common.Constants;
using System;
using System.Collections.Generic;
using System.Linq;

namespace App.Common.Helpers
{
    public class HttpStatusCodesHelper
    {
        private static readonly Dictionary<int, HttpStatusCodes> _Codes
            = Enum.GetValues<HttpStatusCodes>()
            .ToDictionary(x => Convert.ToInt32(x), x => x);

        public static HttpStatusCodes GetHttpStatusCode(int? value, HttpStatusCodes defaultValue = HttpStatusCodes.OK)
        {
            var key = value ?? 0;

            if (_Codes.ContainsKey(key))
                return _Codes[key];

            return defaultValue;
        }
    }
}
