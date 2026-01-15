"use client";

import { useEffect } from "react";
import { Spin, Empty, Card, Row, Col, Typography, Button, Tag } from "antd";
import { useDataEncoderStore } from "@/modules/data-encoder/data-encoder.store";

const { Title, Text } = Typography;

export default function CustomerListPage() {
  const { customers, loading, getCustomers } = useDataEncoderStore();

  useEffect(() => {
    getCustomers(2); // active customers only
  }, []);

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
            <Card
              bordered={false}
              className="rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <Text strong className="text-lg">
                  {customer.businessName}
                </Text>
                {customer.isVerified && (
                  <Tag color="green" className="font-medium">
                    Verified
                  </Tag>
                )}
              </div>

              {/* CUSTOMER INFO */}
              <div className="space-y-2 text-gray-700 text-sm">
                <div>
                  <strong>TIN:</strong> {customer.tinNumber}
                </div>
                <div>
                  <strong>Business License:</strong> {customer.businessLicense}
                </div>
                <div>
                  <strong>Address:</strong> {customer.businessAddress}, {customer.city},{" "}
                  {customer.state} - {customer.postalCode}
                </div>
                <div>
                  <strong>Contact:</strong> {customer.contactPerson} | {customer.contactPhone}
                </div>
                <div>
                  <strong>Email:</strong> {customer.contactEmail}
                </div>
                <div>
                  <strong>Business Type:</strong> {customer.businessType}
                </div>
                <div>
                  <strong>Import License:</strong> {customer.importLicense} | Expiry:{" "}
                  {customer.importLicenseExpiry ?? "N/A"}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-3">
                <Button type="primary" className="flex-1">
                  View
                </Button>
                <Button className="flex-1">Edit</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
