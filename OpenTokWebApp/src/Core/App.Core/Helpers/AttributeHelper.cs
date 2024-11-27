using System;
using System.Linq;
using System.Reflection;

namespace App.Core.Helpers
{
    public static class AttributeHelper
    {
        public static TAttribute CreateAttribute<TAttribute>(CustomAttributeData data)
                where TAttribute : Attribute
        {
            // Extract constructor arguments
            var constructorArgs = data.ConstructorArguments.Select(arg => arg.Value).ToArray();

            // Create an instance of the attribute
            var attribute = (TAttribute)Activator.CreateInstance(data.AttributeType, constructorArgs);

            // Set named arguments (properties or fields)
            foreach (var namedArg in data.NamedArguments)
            {
                if (namedArg.MemberInfo is PropertyInfo propertyInfo)
                    propertyInfo.SetValue(attribute, namedArg.TypedValue.Value);
                else if (namedArg.MemberInfo is FieldInfo fieldInfo)
                    fieldInfo.SetValue(attribute, namedArg.TypedValue.Value);
            }

            return attribute;
        }
    }
}
