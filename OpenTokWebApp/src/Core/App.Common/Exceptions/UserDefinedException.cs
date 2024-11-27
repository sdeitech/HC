using System;
using System.Collections.Generic;

namespace App.Common.Exceptions
{
    public class UserDefinedException : Exception
    {
        public UserDefinedException(string errorMessage)
           : base(errorMessage)
        {
            Errors = new Dictionary<string, string>
            {
                { "Error", errorMessage },
                { "StackTrace", base.StackTrace }
            };
        }

        public IDictionary<string, string> Errors { get; }
    }
}
