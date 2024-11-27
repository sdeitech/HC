using App.Common.Attributes;
using App.Core.Helpers;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace App.Core.Extensions
{
    public static class BusinessServicesExtensions
    {
        public static IServiceCollection RegisterApplicationServices(this IServiceCollection services, params Assembly[] assemblies)
        {
            services.RegisterTransientServices(assemblies);
            services.RegisterScopedServices(assemblies);
            services.RegisterSingletonServices(assemblies);

            return services;
        }

        private static IServiceCollection RegisterTransientServices(this IServiceCollection services, params Assembly[] assemblies)
        {
            var mappedTypes = MappedTypesFactory.GetMappedTypesFromAssemblies<TransientServiceAttribute>(assemblies);

            foreach (var mappedType in mappedTypes)
                services.AddTransient(mappedType.Key, mappedType.Value);

            return services;
        }

        private static IServiceCollection RegisterScopedServices(this IServiceCollection services, params Assembly[] assemblies)
        {
            var mappedTypes = MappedTypesFactory.GetMappedTypesFromAssemblies<ScopedServiceAttribute>(assemblies);

            foreach (var mappedType in mappedTypes)
                services.AddScoped(mappedType.Key, mappedType.Value);

            return services;
        }

        private static IServiceCollection RegisterSingletonServices(this IServiceCollection services, params Assembly[] assemblies)
        {
            var mappedTypes = MappedTypesFactory.GetMappedTypesFromAssemblies<SingletonServiceAttribute>(assemblies);

            foreach (var mappedType in mappedTypes)
                services.AddSingleton(mappedType.Key, mappedType.Value);

            return services;
        }
    }
}
