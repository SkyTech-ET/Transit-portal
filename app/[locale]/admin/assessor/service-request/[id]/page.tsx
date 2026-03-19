"use client";

import { useEffect, useState } from "react";
import { Card, Button, Tag, Divider, Spin, message } from "antd";
import {
  CheckCircleOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getPendingServiceReviews, reviewService } from "@/modules/assessor/assessor.endpoints";

export default function ServiceRequestReviewPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getPendingServiceReviews();

     
      const data = res;

      if (!data || (Array.isArray(data) && data.length === 0)) {
        message.warning("No pending service reviews");
        setServices([]);
        return;
      }

      // backend may return object or array
      setServices(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      message.error("Failed to load service requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleReview = async (serviceId: number, status: number) => {
    try {
      await reviewService({
        serviceId,
        status, 
        comments: null,
      });
      message.success("Service updated successfully");
      fetchServices();
    } catch (e) {
      console.error(e);
      message.error("Action failed");
    }
  };

  if (loading) return <Spin />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Pending Service Initiation Requests
        </h2>
        <div className="flex gap-2">
          <Button type="primary">Approve All</Button>
          <Button icon={<ReloadOutlined />} onClick={fetchServices}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold">
                  {service.customer?.firstName}{" "}
                  {service.customer?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {service.customer?.role ?? "Customer"}
                </p>
              </div>
              <Tag color="gold">{service.routeCategory}</Tag>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <p className="text-gray-500">Item Description</p>
                <p>{service.itemDescription}</p>
              </div>
              <div>
                <p className="text-gray-500">Route Category</p>
                <p>{service.routeCategory}</p>
              </div>
              <div>
                <p className="text-gray-500">Declared Value</p>
                <p>{service.declaredValue}</p>
              </div>
              <div>
                <p className="text-gray-500">Tax Category</p>
                <p>{service.taxCategory}</p>
              </div>
            </div>

            <Divider />

            <div className="flex gap-2">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                className="bg-green-600"
                onClick={() => handleReview(service.id, 1)}
              >
                Approve
              </Button>

              <Button
                icon={<ReloadOutlined />}
                className="bg-orange-500 text-white"
                onClick={() => handleReview(service.id, 2)}
              >
                Return for Revision
              </Button>

              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReview(service.id, 3)}
              >
                Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 rounded-xl">
        <h3 className="font-semibold mb-3">Validation Checklist</h3>
        <ul className="space-y-2 text-sm">
          <li>✔ Item description matches supporting documents</li>
          <li>✔ Route category correctly marked</li>
          <li>✔ All required documents attached and legible</li>
          <li>✔ Declared value and tax category are accurate</li>
        </ul>
      </Card>
    </div>
  );
}
