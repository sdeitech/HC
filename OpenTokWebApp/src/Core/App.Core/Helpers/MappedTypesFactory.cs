using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace App.Core.Helpers
{
    public static class MappedTypesFactory
    {
        public static IEnumerable<KeyValuePair<Type, Type>> GetMappedTypesFromAssemblies<TType>(params Assembly[] assemblies)
            where TType : Attribute
        {
            foreach (var assembly in assemblies)
            {
                var types = assembly.GetExportedTypes()
                    .Where(x => x.GetCustomAttribute(typeof(TType)) != null);

                foreach (var type in types)
                    yield return new KeyValuePair<Type, Type>(GetBaseType(type), type);
            }
        }

        private static Type GetBaseType(Type type)
        {
            var interfaces = type.GetTypeInfo().GetInterfaces();

            if (interfaces.Length == 0 || interfaces.Length > 1)
                return type;

            return interfaces[0];
        }
    }
}
