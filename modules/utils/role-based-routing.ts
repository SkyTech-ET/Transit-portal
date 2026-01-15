import { IUser } from "../user/user.types";

export interface RoleRoute {
  roleName: string;
  route: string;
  description: string;
}

export const ROLE_ROUTES: RoleRoute[] = [
  {
    roleName: "SuperAdmin",
    route: "/admin/dashboard",
    description: "Super Administrator Dashboard"
  },
  {
    roleName: "Admin", 
    route: "/admin/dashboard",
    description: "Administrator Dashboard"
  },
  {
    roleName: "Manager",
    route: "/admin/manager/dashboard",
    description: "Manager - Service Management"
  },
  {
    roleName: "Assessor",
    route: "/admin/assessor/dashboard",
    description: "Assessor - Customer Verification"
  },
  {
    roleName: "CaseExecutor",
    route: "/admin/case-executor/dashboard",
    description: "Case Executor - Service Execution"
  },
  {
    roleName: "DataEncoder",
    route: "/admin/data-encoder/dashboard",
    description: "Data Encoder - Service Creation"
  },
  {
    roleName: "Customer",
    route: "/admin/mot/customers",
    description: "Customer Dashboard"
  },
  {
    roleName: "Customers",
    route: "/client/dashboard",
    description: "Customer Dashboard"
  }
];

/**
 * Determines the appropriate route for a user based on their roles
 * @param user - The logged-in user
 * @returns The route path to redirect to
 */
export const getRoleBasedRoute = (user: IUser | null): string => {
  if (!user || !user.roles || user.roles.length === 0) {
    return "/admin/dashboard"; // Default fallback
  }

  // Get the first role (users typically have one primary role)
  const primaryRole = user.roles[0];
  
  // Find the route for this role
  const roleRoute = ROLE_ROUTES.find(route => 
    route.roleName.toLowerCase() === primaryRole.roleName?.toLowerCase()
  );

  if (roleRoute) {
    console.log(`🔍 DEBUG: Redirecting user with role "${primaryRole.roleName}" to: ${roleRoute.route}`);
    return roleRoute.route;
  }

  // Fallback to default dashboard
  console.log(`🔍 DEBUG: No specific route found for role "${primaryRole.roleName}", using default dashboard`);
  return "/admin/dashboard";
};

/**
 * Gets the role-specific dashboard information
 * @param user - The logged-in user
 * @returns Role route information
 */
export const getRoleInfo = (user: IUser | null): RoleRoute | null => {
  if (!user || !user.roles || user.roles.length === 0) {
    return null;
  }

  const primaryRole = user.roles[0];
  return ROLE_ROUTES.find(route => 
    route.roleName.toLowerCase() === primaryRole.roleName?.toLowerCase()
  ) || null;
};
