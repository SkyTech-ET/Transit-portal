"use client";

import { useEffect, useState } from "react";
import {
  Spin,
  Empty,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Modal,
  Divider,
} from "antd";
import { useDataEncoderStore } from "@/modules/data-encoder/data-encoder.store";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function CustomerListPage() {
  const { customers, loading, getCustomers } = useDataEncoderStore();
  const router = useRouter();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    getCustomers(2); // active customers only
  }, []);

  const openViewModal = (customer: any) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCustomer(null);
  };

  const getFileUrl = (path?: string) => {
    if (!path) return undefined; 
    return path.startsWith("http")
      ? path
      : `https://transitportal.skytechet.com/${path}`;
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Active Customers</Title>
        <Button type="primary" onClick={() => getCustomers(2)}>
          Refresh
        </Button>
      </div>

      {/* EMPTY STATE */}
      {customers.length === 0 && <Empty description="No active customers" />}

      {/* CUSTOMER CARDS */}
      <Row gutter={[16, 16]}>
        {customers.map((customer) => (
          <Col xs={24} sm={12} lg={8} key={customer.id}>
            <Card bordered={false} className="rounded-xl shadow-md p-6">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <Text strong className="text-lg">
                  {customer.businessName}
                </Text>
                {customer.isVerified && (
                  <Tag color="green">Verified</Tag>
                )}
              </div>

              {/* BASIC INFO */}
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <strong>TIN:</strong> {customer.tinNumber}
                </div>
                <div>
                  <strong>Contact:</strong> {customer.contactPerson}
                </div>
                <div>
                  <strong>Email:</strong> {customer.contactEmail}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-3">
                <Button className="flex-1" onClick={() => openViewModal(customer)}>
                  View
                </Button>

                {/* <Button className="flex-1">Edit</Button> */}

                <Button
                  type="primary"
                  className="flex-1"
                  onClick={() => {
                    if (!customer.userId) {
                      console.error("Customer has no userId");
                      return;
                    }
                    router.push(
                      `/admin/mot/customers/services/create/${customer.userId}`
                    );
                  }}
                >
                  Create Service
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* VIEW CUSTOMER MODAL */}
      <Modal
        title="Customer Details"
        open={isViewModalOpen}
        onCancel={closeViewModal}
        footer={[
          <Button key="close" onClick={closeViewModal}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedCustomer && (
          <>
            <Title level={5}>{selectedCustomer.businessName}</Title>
            <Divider />

            {/* <p><strong>Customer ID:</strong> {selectedCustomer.id}</p>
            <p><strong>User ID:</strong> {selectedCustomer.userId}</p>  */}
            <p><strong>TIN Number:</strong> {selectedCustomer.tinNumber}</p>
            <p>
  <strong>Business License:</strong>{" "}
  {selectedCustomer.businessLicense ? (
    <Button
      type="link"
      href={getFileUrl(selectedCustomer.businessLicense)}
      target="_blank"
    >
      View Document
    </Button>
  ) : (
    "N/A"
  )}
</p>

{selectedCustomer.businessLicense && (
  <>
    <Divider />
    <Text strong>Business License Preview</Text>
    <iframe
      src={getFileUrl(selectedCustomer.businessLicense)}
      className="w-full h-[400px] border rounded-md mt-2"
    />
  </>
)}
<Divider />


            <p><strong>Business Type:</strong> {selectedCustomer.businessType}</p>

            <Divider />

            {/* <p>
              <strong>Address:</strong>{" "}
              {selectedCustomer.businessAddress}, {selectedCustomer.city},{" "}
              {selectedCustomer.state} - {selectedCustomer.postalCode}
            </p> */}

            <p>
  <strong>Business Address Document:</strong>{" "}
  {selectedCustomer.businessAddress ? (
    <Button
      type="link"
      href={getFileUrl(selectedCustomer.businessAddress)}
      target="_blank"
    >
      View Document
    </Button>
  ) : (
    "N/A"
  )}
</p>




            <Divider />

            <p><strong>Contact Person:</strong> {selectedCustomer.contactPerson}</p>
            <p><strong>Phone:</strong> {selectedCustomer.contactPhone}</p>
            <p><strong>Email:</strong> {selectedCustomer.contactEmail}</p>

            <Divider />

            <p>
              <strong>Import License:</strong>{" "}
              {selectedCustomer.importLicense ?? "N/A"}
            </p>
            <p>
              <strong>Import License Expiry:</strong>{" "}
              {selectedCustomer.importLicenseExpiry ?? "N/A"}
            </p>

            <Divider />

            <p>
              <strong>Status:</strong>{" "}
              {selectedCustomer.isVerified ? (
                <Tag color="green">Verified</Tag>
              ) : (
                <Tag color="red">Not Verified</Tag>
              )}
            </p>
          </>
        )}
      </Modal>
    </div>
  );
}
