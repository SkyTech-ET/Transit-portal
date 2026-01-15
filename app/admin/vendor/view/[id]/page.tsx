"use client";

import { useEffect, useState } from "react";
import { useBookingStore } from "@/modules/booking";
//import { IDocument, useDocumentStore } from "@/modules/document";
import { RecordStatus } from "@/modules/common/common.types";
import { usePackageStore } from "@/modules/package";
import { useReportStore } from "@/modules/report";
import { useUserStore } from "@/modules/user";
import { getDefaultFilter } from "@/modules/utils";
import permission from "@/modules/utils/permission/permission";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";
import { vendorRoutes } from "@/modules/vendor/vendor.routes";
import { useVendorStore } from "@/modules/vendor/vendor.store";
import { Tabs, TabsProps } from "antd";
import {
  Building,
  CalendarCheck,
  CreditCard,
  DollarSign,
  File,
  Folders,
  Menu,
  Package,
  Users,
  Utensils,
} from "lucide-react";

import BookingTable from "@/app/admin/booking/components/BookingTable";
import CustomBreadcrumb from "@/app/admin/components/common/CustomBreadcrumb";
import LoadingDialog from "@/app/admin/components/common/LoadingDialog";
//import DocumentTable from "@/app/admin/document/components/DocumentTable";
import ReportCardItem from "@/app/admin/dashboard/components/ReportCardItem";
import PackageTable from "@/app/admin/package/components/PackageTable";
import UserTable from "@/app/admin/user/components/UserTable";

//import OrderTable from "@/app/admin/order/components/OrderTable";
//import { IPaymentPayload, useOrderStore } from "@/modules/order";
import VendorDetail from "../../components/VendorDetail";

//import SubscriptionTable from "@/app/admin/subscription/components/SubscriptionTable";
//import OrderPaymentFormDrawer from "@/app/admin/order/components/OrderPaymentFormDrawer";

interface Props {
  params: {
    id: number;
  };
}

const ViewVendor = ({ params }: Props) => {
  const [orderId, setOrderId] = useState<any>();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const { checkPermission, permissions } = usePermissionStore();
  const { listLoading: userLoading, orgUsers, getUsersByOrg } = useUserStore();
  const {
    listLoading: bookingLoading,
    orgBookings,currentPage, totalPages, 
    getBookingsByOrg,
  } = useBookingStore();
  const {
    listLoading: packageLoading,
    orgPackages,
    getPackagesByOrg,
  } = usePackageStore();
  const {
    getReportsByOrg,
    listLoading: reportLoading,
    reportPerVendor,
  } = useReportStore();
  const { vendor, loading: orgLoading, getVendor } = useVendorStore();
  //const { listLoading: documentLoading, documents, getDocumentsByOrg } = useDocumentStore()
  //const { listLoading: orderLoading, orders, getOrdersByOrg, madePayment } = useOrderStore()

  const filterPayload = getDefaultFilter();
  const onCancel = () => {
    setIsDrawerVisible(false);
  };
  const onClickPay = (id: number) => {
    setOrderId(id), setIsDrawerVisible(true);
  };
  const onChange = (key: string) => {
    // if (key == '2') {
    //     getOrdersByOrg(params.id, RecordStatus.Active)
    // } else if (key == '3') {
    //     getDocumentsByOrg(params.id, RecordStatus.Active)
    // } else if (key == '4') {
    //     getUsersByOrg(params.id, RecordStatus.Active)
    // }
  };
  // const onPay = (payload: IPaymentPayload) => {
  //     payload.orderId = orderId
  //     madePayment(payload).then(() => {
  //         setIsDrawerVisible(false)
  //         getOrdersByOrg(params.id, RecordStatus.Active)
  //     })
  // }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Users",
      children: (
        <UserTable
          loading={userLoading}
          users={orgUsers}
          canUpdate={checkPermission(permissions, permission.user.update)}
          canDelete={checkPermission(permissions, permission.user.delete)}
          canReset={checkPermission(
            permissions,
            permission.password.resetPassword
          )}
          currentPage={0}
          totalPages={0}
          searchTerm={""}
        />
      ),
    },
    {
      key: "2",
      label: "Orders",
      children: (
        <BookingTable
        currentPage={currentPage}
        totalPages={totalPages}
          loading={bookingLoading}
          bookings={orgBookings}
          canUpdate={checkPermission(permissions, permission.booking.update)}
        />
      ),
    },
    {
      key: "3",
      label: "Packages",
      children: (
        <PackageTable
          loading={packageLoading}
          packages={orgPackages}
          canUpdate={checkPermission(permissions, permission.package.update)}
          canDelete={checkPermission(permissions, permission.package.delete)}
        />
      ),
    },
  ];

  useEffect(() => {
    getReportsByOrg(params.id);
    getVendor(params.id);
    getUsersByOrg(params.id, RecordStatus.Active);
    getBookingsByOrg(params.id,RecordStatus.Active);
    getPackagesByOrg(params.id, RecordStatus.Active);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 rounded-md bg-white p-6">
        <div className="flex">
          <CustomBreadcrumb
            items={[
              {
                key: 1,
                title: "Vendors",
                route: vendorRoutes.getall,
              },
              {
                key: 2,
                title: "Details",
                route: "#",
              },
            ]}
          />
        </div>
        <VendorDetail vendor={vendor} />
        <div className="flex flex-col gap-6 rounded-md bg-slate-50 p-4 md:flex-row md:px-6">
          <ReportCardItem
            title="Menus"
            value={reportPerVendor?.menus ?? 0}
            prefix={<Menu />}
            bgColor="blue"
          />
          <ReportCardItem
            title="Orders"
            value={reportPerVendor?.orders ?? 0}
            prefix={<Utensils />}
            bgColor="green"
          />
          <ReportCardItem
            title="Packages"
            value={reportPerVendor?.packages ?? 0}
            prefix={<Package />}
            bgColor="blue"
          />
          <ReportCardItem
            title="Users"
            value={reportPerVendor?.users ?? 0}
            prefix={<Users />}
            bgColor="green"
          />
        </div>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        {/* <OrderPaymentFormDrawer
                    loading={orderLoading}
                    visible={isDrawerVisible}
                    onClose={onCancel}
                    onPay={onPay} /> */}
        <LoadingDialog visible={orgLoading || reportLoading} />
      </div>
    </>
  );
};

export default ViewVendor;
