"use client";

import { Button } from "antd";
import { useRouter } from 'next/navigation';
import EventTable from "./components/EventTable";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { eventRoutes } from '@/modules/event/event.routes';
import { useEventStore } from "@/modules/event/event.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const EventPage = () => {
  const router = useRouter()
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
  const { checkPermission, permissions, currentUser } = usePermissionStore()
  const { filteredEvents, listLoading: loading, getEvents } = useEventStore();

  useEffect(() => {
     getEvents(RecordStatus.Active)
  }, [getEvents])

  const handleAdd = () => { router.push(eventRoutes.create) };
  const handleFilter = (status: RecordStatus) => {
    setStatus(status)
    getEvents(status)
  }
  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <div className="flex px-6">
        <h1 className="text-lg font-bold">Events</h1>
        {
          checkPermission(permissions, permission.event.create) &&
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            className="ml-auto"
            onClick={handleAdd}
          >
            New Event
          </Button>
        }
      </div>
      <RecordStatusFilter status={status} onFilter={handleFilter} />
      <EventTable
        loading={loading}
        events={filteredEvents}
        canUpdate={checkPermission(permissions, permission.event.update)}
        canDelete={checkPermission(permissions, permission.event.delete)}
      />
    </div>
  );
};

export default EventPage;
