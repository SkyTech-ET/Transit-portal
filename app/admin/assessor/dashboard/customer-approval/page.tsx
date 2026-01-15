"use client";

import { useEffect } from "react";
import { Spin, Empty, Button } from "antd";
import { useAssessorStore } from "@/modules/assessor/assessor.store";

export default function CustomerApprovalPage() {
  const {
    pendingCustomers,
    loading,
    getPendingCustomers,
    approveCustomer,
  } = useAssessorStore();

  useEffect(() => {
    getPendingCustomers();
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
        <h2 className="text-xl font-semibold">
          New Customer Submissions
        </h2>
        <Button onClick={getPendingCustomers}>Refresh</Button>
      </div>

      {/* EMPTY STATE */}
      {pendingCustomers.length === 0 && (
        <Empty description="No pending customer approvals" />
      )}

      {/* CUSTOMER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            {/* CUSTOMER HEADER */}
            <div className="flex items-center gap-3 mb-4">
<img
  src={`http://transitportal.skytechet.com:5002/${customer.user?.profilePhoto.replaceAll("\\", "/")}`}
  alt="profile"
  className="w-10 h-10 rounded-full object-cover"
/>
              <div>
                <div className="font-semibold">
                  {customer.user?.firstName} {customer.user?.lastName}
                </div>
                <div className="text-xs text-yellow-600 bg-yellow-100 inline-block px-2 py-0.5 rounded">
                  Pending
                </div>
              </div>
            </div>

            {/* CUSTOMER INFO */}
            <div className="text-sm text-gray-700 space-y-2 mb-4">
              <div><strong>Business:</strong> {customer.businessName}</div>
              <div><strong>TIN:</strong> {customer.tinNumber}</div>
              <div><strong>Phone:</strong> {customer.contactPhone}</div>
              <div><strong>Email:</strong> {customer.contactEmail}</div>
              <div><strong>City:</strong> {customer.city}</div>
            </div>

            {/* DOCUMENTS */}
            <div className="mb-4">
              <div className="font-medium text-sm mb-1">Documents</div>
              {customer.documents?.length > 0 ? (
                customer.documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex justify-between text-sm text-blue-600"
                  >
                    <span>{doc.documentType}</span>
                    <a href={`/${doc.filePath}`} target="_blank">
                      View
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400">
                  No documents attached
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <Button
                type="primary"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => approveCustomer(customer.id)}
              >
                Approve
              </Button>

              <Button className="bg-yellow-500 text-white hover:bg-yellow-600">
                Request Revision
              </Button>

              <Button danger>Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
