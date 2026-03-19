"use client";

import { useEffect, useState } from "react";
import { Card, Button, Tag, Spin, message } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import {
  getServicesUnderOversight,
  getComplianceIssues,
  reviewService,
} from "@/modules/assessor/assessor.endpoints";

export default function CaseReviewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const servicesRes = await getServicesUnderOversight();
      const services = servicesRes;

      const current = services?.find((s: any) => String(s.id) === id);
      if (!current) throw new Error("Service not found");

      setService(current);

      const issuesRes = await getComplianceIssues();
      setIssues(issuesRes ?? []);
    } catch (e) {
      message.error("Failed to load case review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ================= ACTIONS =================
  const endorseCompliance = async () => {
    try {
      await reviewService({
        serviceId: service.id,
        status: 1,
        comments: "Endorsed for compliance",
      });
      message.success("Case endorsed");
      router.back();
    } catch {
      message.error("Action failed");
    }
  };

  const markIncomplete = async () => {
    try {
      await reviewService({
        serviceId: service.id,
        status: 2,
        comments: "Marked as incomplete",
      });
      message.success("Case marked incomplete");
      router.back();
    } catch {
      message.error("Action failed");
    }
  };

  if (loading || !service) return <Spin />;

  // ================= STATUS BADGE =================
  const renderStatus = (status: number) => {
    if (status === 1) return <Tag color="green">Completed</Tag>;
    if (status === 2) return <Tag color="orange">Review Needed</Tag>;
    if (status === 3) return <Tag color="blue">In Progress</Tag>;
    return <Tag color="red">Rejected</Tag>;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Case Review and Compliance Check</h2>
        <p className="text-sm text-gray-500">
          Detailed stage-wise breakdown, Data Encoder & Case Executor review
        </p>
      </div>

      {/* STAGES */}
      <Card className="rounded-xl">
        <h3 className="font-semibold mb-4">Stage-by-Stage Breakdown</h3>

        {[
          "Data Collection",
          "Data Validation",
          "Case Analysis",
          "Final Decision",
        ].map((stage, index) => (
          <div
            key={stage}
            className="flex items-center justify-between p-4 mb-3 bg-gray-100 rounded-lg"
          >
            <div>
              <p className="font-semibold">
                {index + 1}. {stage}
              </p>
              <p className="text-sm text-gray-500">
                {service.itemDescription}
              </p>
            </div>

            {renderStatus(service.status)}
          </div>
        ))}
      </Card>

      {/* COMPLIANCE ISSUES */}
      {issues.length > 0 && (
        <Card className="mt-6 rounded-xl">
          <h3 className="font-semibold mb-3">Compliance Remarks</h3>
          <ul className="list-disc ml-5 text-sm">
            {issues
              .filter((i) => i.serviceNumber === service.serviceNumber)
              .map((issue) => (
                <li key={issue.id}>{issue.issue}</li>
              ))}
          </ul>
        </Card>
      )}

      {/* ACTIONS */}
      <div className="flex justify-between mt-6">
        <Button onClick={() => router.back()}>Back to Cases</Button>

        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={endorseCompliance}
          >
            Endorse for Compliance
          </Button>

          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={markIncomplete}
          >
            Mark as Incomplete
          </Button>
        </div>
      </div>
    </div>
  );
}
