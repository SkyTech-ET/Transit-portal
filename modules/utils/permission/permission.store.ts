import { create } from "zustand";
import { IUser } from '@/modules/user';
import { getUserData } from "../token/user.storage";
import { IPrivilege } from "@/modules/privilege";
import permission from "./permission";

interface State {
    error: any;
    currentUser: IUser | null;
    permissions: IPrivilege[];
    loading: boolean;
    isAdmin: boolean
}

interface Actions {
    fetchFromLocalStorage: () => Promise<void>;
    checkPermission: (permissions: any[], action: string) => any;
}

const initialState: State = {
    currentUser: null,
    permissions: [],
    loading: false,
    error: null,
    isAdmin: false
};
const adminPermissions = [permission.user.getAll, permission.role.getAll, permission.privilege.getAll,
 permission.subscription.getAll,permission.event.getAll,permission.contact.getAll,permission.subscriptionPackage.getAll
];

const checkIsUserAdmin = (privileges: any[]) => {
    const listPer = adminPermissions.filter(action => {
        const privilege = privileges?.find(privilege => privilege.action === action);
        return privilege !== undefined;
    });
    // Exclude Subscription-GetAll
    return listPer.filter((l) => l != 'Subscription-GetAll').length > 0
}

export const usePermissionStore = create<State & Actions>((set) => ({
    ...initialState,
    fetchFromLocalStorage: async () => {
        set({ loading: true });
        try {
            const user = getUserData();
            if (user && user.roles && user.roles.length > 0) {
                // Collect all privileges from all roles
                const allPrivileges: IPrivilege[] = [];
                user.roles.forEach(role => {
                    if (role.privileges && role.privileges.length > 0) {
                        allPrivileges.push(...role.privileges);
                    }
                });
                
                // Remove duplicates based on action
                const uniquePrivileges = allPrivileges.filter((privilege, index, self) => 
                    index === self.findIndex(p => p.action === privilege.action)
                );
                
                const admin = checkIsUserAdmin(uniquePrivileges as any);
                const isAdminRole = user.roles.some(role => role.roleName === 'Admin');
                
                console.log('🔍 DEBUG: User roles:', user.roles);
                console.log('🔍 DEBUG: All privileges:', uniquePrivileges);
                console.log('🔍 DEBUG: Is admin role:', isAdminRole);
                console.log('🔍 DEBUG: Is admin by privileges:', admin);
                
                set({ 
                    currentUser: user, 
                    isAdmin: isAdminRole || admin, 
                    permissions: uniquePrivileges, 
                    loading: false 
                });
            } else {
                console.log('🔍 DEBUG: No user data or roles found');
                set({ loading: false });
            }
        } catch (error) {
            console.error('🔍 DEBUG: Error fetching user data:', error);
            set({ error, loading: false });
        }
    },
    checkPermission: (privileges: any[], action: string) => {
        return privileges.some(privilege => privilege.action === action);
    },
}));
