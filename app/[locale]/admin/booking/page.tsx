"use client";

import { Button } from "antd";
import { useRouter } from 'next/navigation';
import BookingTable from "./components/BookingTable";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { bookingRoutes } from '@/modules/booking/booking.routes';
import { useBookingStore } from "@/modules/booking/booking.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const BookingPage = () => {
  const router = useRouter()
  const [orgId, setOrgId] = useState<any>()
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
  const { checkPermission, permissions, currentUser } = usePermissionStore()
  const { filteredBookings,currentPage, totalPages, listLoading: loading,success, getBookingsByOrg } = useBookingStore();

  useEffect(() => {
    if (currentUser?.organization?.id != null) {
      setOrgId(currentUser.organization.id)
      getBookingsByOrg(currentUser.organization.id, status)
    }
    console.log("object",currentUser);
  }, [getBookingsByOrg, currentUser])
  useEffect(() => {
    if (success) {
        getBookingsByOrg(currentUser!.organization.id, status);
    }
}, [success]); 
  const handleAdd = () => { router.push(bookingRoutes.create) };
  const handleFilter = (status: RecordStatus) => {
    setStatus(status)
    getBookingsByOrg(orgId as any, status as number)
  }

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <div className="flex px-6">
        <h1 className="text-lg font-bold">Orders</h1>
        {
          checkPermission(permissions, permission.booking.create) &&
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            className="ml-auto"
            onClick={handleAdd}
          >
            New Order
          </Button>
        }
      </div>
      <RecordStatusFilter status={status} onFilter={handleFilter} />
      <BookingTable
        loading={loading}
        bookings={filteredBookings}
        currentPage={currentPage}
        totalPages={totalPages}
        canUpdate={checkPermission(permissions, permission.booking.update)}
        />
    </div>
  );
};

export default BookingPage;
