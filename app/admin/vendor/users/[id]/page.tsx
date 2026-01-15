
"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/modules/user/user.store";
import UserTable from "@/app/admin/user/components/UserTable";
import VendorDetail from "../../components/VendorDetail";
import { useVendorStore } from "@/modules/vendor/vendor.store";
import { vendorRoutes } from "@/modules/vendor/vendor.routes";
import SearchFiled from "@/app/admin/components/common/SearchFiled";
import LoadingDialog from "@/app/admin/components/common/LoadingDialog";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";
import permission from "@/modules/utils/permission/permission";
import CustomBreadcrumb from "@/app/admin/components/common/CustomBreadcrumb";
import { RecordStatus } from "@/modules/common/common.types";

interface Props {
    params: {
        id: number;
    };
}

const UsersByVendor = ({ params }: Props) => {

    const [searchInput, setSearchInput] = useState<string>('');
    const { checkPermission, permissions } = usePermissionStore()
    const { listLoading, filteredUsers, setSearchTerm, getUsersByOrg } = useUserStore();
    const { vendor, loading: orgLoading, getVendor } = useVendorStore();

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchInput(searchTerm);
        setSearchTerm(searchTerm);
    };

    useEffect(() => { getVendor(params.id), getUsersByOrg(params.id,RecordStatus.Active) }, [getVendor, getUsersByOrg])


    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Vendors',
                            route: vendorRoutes.getall,
                        },
                        {
                            key: 2,
                            title: vendor?.name!,
                            route: "#"
                        },
                    ]}
                />
            </div>
            <VendorDetail vendor={vendor} />
            <div className="border border-gray-50"></div>
            <SearchFiled searchTerm={searchInput} onSearch={onSearch} placeholder="Search users..." />
            <UserTable loading={listLoading} users={filteredUsers}
            canUpdate={checkPermission(permissions, permission.user.update)}
            canDelete={checkPermission(permissions, permission.user.delete)}
            canReset={checkPermission(permissions, permission.password.resetPassword)} currentPage={0} totalPages={0} searchTerm={""}            />
            <LoadingDialog visible={orgLoading} />
        </div>
    );
}

export default UsersByVendor;