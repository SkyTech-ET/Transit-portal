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

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 py-4 sm:px-6 lg:px-8">
      {/* -------------------- HEADER -------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-base sm:text-xl font-semibold">
          New Customer Submissions
        </h2>

        <Button onClick={getPendingCustomers} className="w-full sm:w-auto">
          Refresh
        </Button>
      </div>

      {/* -------------------- EMPTY STATE -------------------- */}
      {!loading && pendingCustomers.length === 0 && (
        <Empty description="No pending customer approvals" />
      )}

      {/* -------------------- CUSTOMER CARDS -------------------- */}
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3">
        {pendingCustomers.map((customer) => {
          /* -------- FIX: DERIVE DOCUMENTS FROM BACKEND -------- */
          const derivedDocuments = [
            customer.businessLicense && {
              label: "Business License",
              path: customer.businessLicense,
            },
            customer.identityProof && {
              label: "Identity Proof",
              path: customer.identityProof,
            },
            customer.taxDocumentation && {
              label: "Tax Documentation",
              path: customer.taxDocumentation,
            },
            customer.businessAddress && {
              label: "Business Address",
              path: customer.businessAddress,
            },
          ].filter(Boolean);

          return (
            <div
              key={customer.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col"
            >
              {/* ---------------- HEADER ---------------- */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={
                    customer.profilePhoto
                      ? `http://transitportal.skytechet.com:5002/${customer.profilePhoto.replaceAll(
                          "\\",
                          "/"
                        )}`
                      : "/avatar-placeholder.png"
                  }
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />

                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {customer.firstName} {customer.lastName}
                  </div>
                  <span className="inline-block mt-1 text-[11px] text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                    Pending
                  </span>
                </div>
              </div>

              {/* ---------------- INFO ---------------- */}
              <div className="text-sm text-gray-700 space-y-1 mb-4">
                <div className="break-words">
                  <strong>Business:</strong> {customer.businessName}
                </div>
                <div>
                  <strong>TIN:</strong> {customer.tinNumber}
                </div>
                <div>
                  <strong>Phone:</strong> {customer.contactPhone}
                </div>
                <div className="break-all">
                  <strong>Email:</strong> {customer.contactEmail}
                </div>
                <div>
                  <strong>City:</strong> {customer.city}
                </div>
              </div>

              {/* ---------------- DOCUMENTS ---------------- */}
              <div className="mb-4">
                <div className="font-medium text-sm mb-1">Documents</div>

                {derivedDocuments.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {derivedDocuments.map((doc: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="truncate text-gray-600">
                          {doc.label}
                        </span>

                        <a
                          href={`http://transitportal.skytechet.com:5002/${doc.path}`}
                          target="_blank"
                          className="text-blue-600 shrink-0"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">
                    No documents attached
                  </div>
                )}
              </div>

              {/* ---------------- ACTIONS ---------------- */}
              <div className="mt-auto flex flex-col gap-2">
                <Button
                  type="primary"
                  className="bg-green-600 hover:bg-green-700 w-full"
                  onClick={() => approveCustomer(customer.id)}
                >
                  Approve
                </Button>

                <Button className="bg-yellow-500 text-white hover:bg-yellow-600 w-full">
                  Request Revision
                </Button>

                <Button danger className="w-full">
                  Reject
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
