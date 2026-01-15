"use client";

import React, { useEffect, useState } from "react";

import { RecordStatus } from "@/modules/common/common.types";
import VendorTable from "./components/VendorTable";
import FilterByRecordStatus from "../components/common/CommonTag";
import VendorPageHeader from "./components/VendorPageHeader";
import VendorTableSearch from "./components/VendorTableSearch";
import { useVendorStore } from "@/modules/vendor/vendor.store";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";
import permission from "@/modules/utils/permission/permission";

const VendorPage = () => {

    const [searchInput, setSearchInput] = useState<string>('');
    const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
    const { checkPermission, permissions } = usePermissionStore()
    const { filteredVendors, listLoading: loading, currentPage, totalPages,setSearchTerm, getVendorsSort } = useVendorStore();

    useEffect(() => { getVendorsSort(RecordStatus.Active) }, [getVendorsSort])

    const onFilter = (status: RecordStatus) => {
        setStatus(status)
        getVendorsSort(status)
    }
    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchInput(searchTerm);
        setSearchTerm(searchTerm);
    };

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white py-6">
            <VendorPageHeader
                canCreate={checkPermission(permissions, permission.vendor.create)}
            />
            <FilterByRecordStatus status={status} onFilter={onFilter} />
            <div className="border-b"></div>
            <VendorTableSearch onSearch={onSearch} searchTerm={searchInput} />
            <VendorTable
                loading={loading}
                vendors={filteredVendors}
                currentPage={currentPage}
                totalPages={totalPages}  
                canUpdate={checkPermission(permissions, permission.vendor.update)}
                canUpdateAcc={checkPermission(permissions, permission.vendor.update)}
                canDelete={checkPermission(permissions, permission.vendor.delete)}
                canView={checkPermission(permissions, permission.vendor.getById)}
                canViewOrgUsers={checkPermission(permissions, permission.user.getByOrg)}
            />
        </div>
    );
}

export default VendorPage;