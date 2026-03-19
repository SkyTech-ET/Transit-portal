"use client";

import React, { useState } from "react";
import { updateBookingStatus } from "@/modules/booking/booking.endpoints";
import { OrderStatus } from "@/modules/common/common.types";
import { parseImage } from "@/modules/utils";
import { dateFormatterWithHours } from "@/modules/utils/formatter";
import { Button, Modal, notification, Popconfirm, Popover, Select } from "antd";
import { PencilLine, Trash } from "lucide-react";
import { create } from "zustand";
import { IBookingStatus } from "@/modules/booking";
import {
  OrderStatusTag,
  RecordStatusTag,
} from "../../components/common/CommonTag";
import BookingOrderStatusForm from "./BookingOrderStatusForm";
import BookingTableAction from "./BookingTableAction";

// Define the type for the store
interface BookingStore {
  error: string | null;
  searchTerm: string;
  loading: boolean;
  bookings: any[];
  orgBookings: any[];
  listLoading: boolean;
  booking: any | null;
  filteredBookings: any[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create the store with explicit typing
export const useBookingStore = create<BookingStore>((set) => ({
  error: null,
  searchTerm: "",
  loading: false,
  bookings: [],
  orgBookings: [],
  listLoading: false,
  booking: null,
  filteredBookings: [],
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

interface Props {
  canUpdate: boolean;
  onReload?: () => void; // Optional reload function passed as a prop
}

export const BookingTableColumn = (props: Props) => {
  const { setLoading, setError } = useBookingStore(); // Use Zustand store methods
  const [isModalVisible, setIsModalVisible] = useState(false);
   const [selectedRecord, setSelectedRecord] = useState<IBookingStatus|null>(null);
  const showModal = (record:any) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",

      render: (name: string, record: any) => {
        const content = (
          <div>
            <p>
              <strong>Company:</strong> {record.company || "N/A"}
            </p>
            <p>
              <strong>Is Inside:</strong> {record.isInside ? "Yes" : "No"}
            </p>
            <p>
              <strong>Number of Guests:</strong>{" "}
              {record.numberOfGuests || "N/A"}
            </p>
            <p>
              <strong>Additional Request:</strong>{" "}
              {record.additionalRequest || "N/A"}
            </p>
            <p>
              <strong>Event Address:</strong> {record.eventAddress || "N/A"}
            </p>
            <p>
              <strong>Catering Type:</strong> {record.cateringType || "N/A"}
            </p>
          </div>
        );

        return (
          <Popover content={content} title="More Info" trigger="click">
            <Button type="link">{name || "More Info"}</Button>
          </Popover>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "emailAddress",
      key: "emailAddress",
    },
    {
      title: "Start Date",
      dataIndex: "eventStartDate",
      key: "eventStartDate",
      render: (value: string) =>
        value ? (
          <span>{dateFormatterWithHours(value)}</span> // Display formatted date with hours
        ) : (
          <span>N/A</span>
        ),
    },
    {
      title: "End Date",
      dataIndex: "eventEndDate",
      key: "eventEndDate",
      render: (value: string) =>
        value ? (
          <span>{dateFormatterWithHours(value)}</span> // Display formatted date with hours
        ) : (
          <span>N/A</span>
        ),
    },
    {
      title: "Package Name",
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (_: any, record: any) => (
        <div>
          <Button type="text" onClick={()=>showModal(record)}>
            <OrderStatusTag status={record.orderStatus} />
          </Button>
         {(props.canUpdate)&&(<Modal
            
            title="Update Order Status"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            >
            <BookingOrderStatusForm
              isVisible={isModalVisible}
              handleCancel={handleCancel}
              payload={{
                id: selectedRecord?.id??0,
                orderStatus: selectedRecord?.orderStatus??0,
              }}
            />
          </Modal>)} 
         
        </div>
      ),
    },
 
  ];
};
