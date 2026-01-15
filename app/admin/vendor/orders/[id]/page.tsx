
"use client";

import { Button } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircleOutlined } from "@ant-design/icons";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
//import OrderTable from "@/app/admin/order/components/OrderTable";
import SearchFiled from "@/app/admin/components/common/SearchFiled";
import VendorDetail from "../../components/VendorDetail";
import LoadingDialog from "@/app/admin/components/common/LoadingDialog";
import CustomBreadcrumb from "@/app/admin/components/common/CustomBreadcrumb";
//import { IPaymentPayload, orderRoutes, useOrderStore } from "@/modules/order";
import { vendorRoutes } from "@/modules/vendor/vendor.routes";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";
import { useVendorStore } from "@/modules/vendor/vendor.store";
//import OrderPaymentFormDrawer from "@/app/admin/order/components/OrderPaymentFormDrawer";

interface Props {
    params: {
        id: number;
    };
}

const OrderByVendor = ({ params }: Props) => {

    const router = useRouter()
    const [searchInput, setSearchInput] = useState<string>('');
    const [orderId, setOrderId] = useState<any>();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const { checkPermission, permissions,isAdmin } = usePermissionStore()

    const { listLoading: orgLoading, vendor, getVendor } = useVendorStore();
    //const { listLoading: loading, filteredOrders, madePayment, setSearchTerm, getOrdersByOrg } = useOrderStore();

    const onCancel = () => { setIsDrawerVisible(false) };
    //const handleAdd = () => { router.push(orderRoutes.create) };
    const onClickPay = (id: number) => { setOrderId(id), setIsDrawerVisible(true) };
    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
    //     setSearchInput(searchTerm);
    //     setSearchTerm(searchTerm);
    // };
    // const onPay = (payload: IPaymentPayload) => {
    //     payload.orderId = orderId
    //     madePayment(payload).then(() => {
    //         setIsDrawerVisible(false)
    //         getOrdersByOrg(params.id, RecordStatus.Active)
    //     })
    }


    //useEffect(() => { getVendor(params.id), getOrdersByOrg(params.id, RecordStatus.Active) }, [isAdmin])


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
            <div className="flex px-6">
                <h1 className="text-lg font-bold">Orders</h1>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    className="ml-auto"
                    //onClick={handleAdd}
                >
                    New Order
                </Button>
            </div>
            <div className="border border-gray-50"></div>
            <SearchFiled searchTerm={searchInput} onSearch={onSearch} placeholder="Search orders..." />
            {/* //<OrderTable loading={loading} orders={filteredOrders} orgId={vendor?.id as any} */}
            canUpdate={checkPermission(permissions, permission.order.update)}
            canDelete={checkPermission(permissions, permission.order.delete)}
            canPay={checkPermission(permissions, permission.order.madePayment)}
            {/* onPay={onClickPay} isAdmin={isAdmin} /> */}
            {/* <OrderPaymentFormDrawer
                loading={loading}
                visible={isDrawerVisible}
                onClose={onCancel}
                onPay={onPay} /> */}
            <LoadingDialog visible={orgLoading} />
        </div>
    );
}

export default OrderByVendor;