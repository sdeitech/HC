using System.Data;

namespace App.Common.Interfaces
{
    public interface IDapperContext
    {
        IDbConnection CreateMasterConnection();
        IDbConnection CreateOrganizationConnection();
        IDbConnection CreateOrganizationConnectionByOrganizationId(int organizationId);
        IDbConnection CreateOrganizationConnectionByBusinessName(string businessName);
        IDbConnection GetConnectionByConnectionString(string connectionString);
    }
}
