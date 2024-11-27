using App.Common.Constants;
using System;
using System.Collections.Generic;
using System.Linq;

namespace App.Common.Helpers
{
    public static class PortalOptionsHelper
    {
        public static readonly List<string> PORTAL_KEYS = Enum.GetNames(typeof(PortalOptions))
            .ToList();

        private static readonly Dictionary<string, List<int>> _PortalRuleMap = new Dictionary<string, List<int>>
        {
            {
                PortalOptions.Client.ToString(),
                new List<int>
                {
                    Convert.ToInt32(OrganizationRoleOptions.Patient)
                }
            },
            {
                PortalOptions.Agency.ToString(),
                new List<int>
                {
                    Convert.ToInt32(OrganizationRoleOptions.Agency)
                }
            },
            {
                PortalOptions.Provider.ToString(),
                new List<int>
                {
                    Convert.ToInt32(OrganizationRoleOptions.ClinicalStaff),
                    Convert.ToInt32(OrganizationRoleOptions.NonClinicalStaff),
                }
            },
        };

        public static (bool isValidPortal, bool isSuperAdmin) IsValidOrSuperAdmin(string portalType)
        {
            bool isValidPortal = PORTAL_KEYS.Any(x => string.Equals(x, portalType));
            bool isSuperAdmin = string.Equals(PortalOptions.SuperAdmin.ToString(), portalType);

            return (isValidPortal, isSuperAdmin);
        }

        public static bool IsValidPortalForRole(string portalType, int roleId)
        {
            foreach (var item in _PortalRuleMap)
            {
                if (!string.Equals(item.Key, portalType, StringComparison.InvariantCultureIgnoreCase))
                    continue;

                return item.Value.Any(x => x == roleId);
            }

            return false;
        }
    }
}
