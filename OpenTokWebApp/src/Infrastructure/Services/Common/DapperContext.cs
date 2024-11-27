using App.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Infrastructure.Services.Common
{
    internal sealed class DapperContext : IDapperContext
    {
        private readonly string connectionString = string.Empty;

        public DapperContext(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public IDbConnection CreateMasterConnection()
        {
            return new SqlConnection(connectionString);
        }

        public IDbConnection CreateOrganizationConnection()
        {
            return new SqlConnection(connectionString);
        }

        public IDbConnection CreateOrganizationConnectionByOrganizationId(int organizationId)
        {
            return new SqlConnection(connectionString);
        }

        public IDbConnection CreateOrganizationConnectionByBusinessName(string businessName)
        {
            return new SqlConnection(connectionString);
        }

        public IDbConnection GetConnectionByConnectionString(string connectionString)
        {
            return new SqlConnection(connectionString);
        }
    }
}
