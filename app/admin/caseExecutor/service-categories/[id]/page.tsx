"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useServiceStore } from "@/modules/mot/service/service.store";
import { IService, IServiceStageExecution, IStageDocument, IServiceMessage, StageStatus, ServiceStatus } from "@/modules/mot/service/service.types";
import { Button, Input, Upload, message as antdMessage } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { ServiceType, ServiceStage } from "@/modules/mot/service/service.types";


type Props = {
  params: { id: string };
};

export default function ServiceDetailPage({ params }: Props) {
  const serviceId = Number(params.id);
  const router = useRouter();

  const {
    currentService,
    getServiceById,
    getServiceStages,
    updateStageStatus,
    loading
  } = useServiceStore();

  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileInput, setFileInput] = useState<File | null>(null);

  // Load service + stages
  useEffect(() => {
    if (!serviceId) return;
    getServiceById(serviceId)
      .then(() => getServiceStages(serviceId))
      .catch((err) => console.error("Failed to load service:", err));
  }, [serviceId, getServiceById, getServiceStages]);

  // When currentService updates, pick the first stage if none chosen
  useEffect(() => {
    if (!selectedStageId && currentService?.stages?.length) {
      setSelectedStageId(currentService.stages[0].id);
    }
  }, [currentService, selectedStageId]);

  //const stages: IServiceStageExecution[] = currentService?.stages || [];
  const stages: IServiceStageExecution[] = React.useMemo(() => {
  if (!currentService?.stages) return [];

  // 🔑 Multimodal → hide 12 & 13
  if (currentService.serviceType === ServiceType.Multimodal) {
    return currentService.stages.filter(
      (s) =>
        s.stage !== ServiceStage.LocalPermission &&
        s.stage !== ServiceStage.Arrival
    );
  }

  // Unimodal → show all
  return currentService.stages;
}, [currentService]);

  const selectedStage = stages.find((s) => s.id === selectedStageId) || null;
  const messages: IServiceMessage[] = currentService?.messages || [];

  // Helper: map Stage enum to readable title (optional)
  const stageTitle = (stageEnumValue: number) => {
    // You can map from ServiceStage enum if you prefer; here we rely on stage.name if provided.
    // If your stage model only has 'stage' numeric value, map it to names as needed.
    // For safety, display the numeric value if no mapping found.
    const map: Record<number, string> = {
      1: "Prepayment Invoice",
      2: "Drop Risk",
      3: "Delivery Order",
      4: "Inspection",
      5: "Emergency",
      6: "Exit",
      7: "Transportation",
      8: "Clearance",
      9: "Local Permission",
      10: "Arrival",
      11: "Store Settlement",
    };
    return map[stageEnumValue] || `Stage ${stageEnumValue}`;
  };

  
  const UPLOAD_URL = (serviceId: number, stageId: number) =>
    `/api/v1/CaseExecutor/services/${serviceId}/stages/${stageId}/documents`;

  const COMMENT_URL = (serviceId: number, stageId: number) =>
    `/api/v1/CaseExecutor/services/${serviceId}/stages/${stageId}/comments`;

  async function handleUpload() {
    if (!fileInput) {
      antdMessage.warning("Please select a file to upload.");
      return;
    }
    if (!selectedStage) {
      antdMessage.error("No stage selected.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", fileInput);
      // optionally append extra metadata:
      // fd.append("description", "Proof of receipt");

      const resp = await fetch(UPLOAD_URL(serviceId, selectedStage.id), {
        method: "POST",
        body: fd,
        // Authorization header is not set here; your browser will send cookies if any.
        // If you need to send a Bearer token, add it here:
        // headers: { Authorization: `Bearer ${token}` }
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Upload failed");
      }

      antdMessage.success("File uploaded successfully.");
      // Refresh stage documents by reloading stages
      await getServiceStages(serviceId);
      setFileInput(null);
    } catch (err: any) {
      console.error("Upload error", err);
      antdMessage.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handlePostComment() {
    if (!commentText?.trim()) {
      antdMessage.warning("Please type a comment.");
      return;
    }
    if (!selectedStage) {
      antdMessage.error("No stage selected.");
      return;
    }

    try {
      const payload = { content: commentText };
      const resp = await fetch(COMMENT_URL(serviceId, selectedStage.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Failed to post comment");
      }

      antdMessage.success("Comment posted.");
      setCommentText("");
      // refresh messages by re-fetching service (server should return new message)
      await getServiceById(serviceId);
    } catch (err: any) {
      console.error("Comment error", err);
      antdMessage.error(err.message || "Failed to post comment");
    }
  }

  async function handleMarkStageCompleted() {
    if (!selectedStage) {
      antdMessage.error("No stage selected.");
      return;
    }
    try {
      // use your store action (updateStageStatus expects stageId and StageStatus)
      await updateStageStatus(selectedStage.id, StageStatus.Completed, "Marked complete by user");
      antdMessage.success("Stage marked as completed.");
      await getServiceStages(serviceId);
      await getServiceById(serviceId);
    } catch (err: any) {
      console.error("Update stage status error", err);
      antdMessage.error(err.message || "Failed to update stage");
    }
  }

  // Helper for rendering stage document list
  const renderStageDocuments = (docs?: IStageDocument[]) => {
    if (!docs || docs.length === 0) return <p className="text-gray-500">No attachments yet.</p>;
    return docs.map((d) => (
      <div key={d.id} className="flex justify-between items-center bg-slate-50 p-3 rounded mb-2">
        <div>
          <div className="font-medium">{d.originalFileName || d.fileName}</div>
          <div className="text-xs text-gray-500">Uploaded: {new Date(d.uploadedDate).toLocaleString()}</div>
        </div>
        <div className="flex items-center gap-3">
          <a href={d.filePath} target="_blank" rel="noreferrer" className="text-blue-600">Download</a>
        </div>
      </div>
    ));
  };

  // UI starts here
  return (
    <div className="p-8">
      <div className="flex gap-8">
        {/* LEFT: Sidebar */}
        <aside className="w-72 space-y-6">
          {/* Service header */}
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <div className="text-sm text-slate-500">Service</div>
            <h3 className="font-semibold text-lg mt-2">{currentService?.serviceNumber ?? `#${serviceId}`}</h3>
            <div className="text-sm text-gray-500 mt-2">
              Started: {currentService?.registeredDate ? new Date(currentService.registeredDate).toLocaleDateString() : "—"}
            </div>
            <div className="mt-3">
              <span className="text-sm text-gray-500">Status:</span>
              <div className="inline-block ml-2 px-2 py-1 rounded text-sm"
                   style={{
                     background: currentService?.status === ServiceStatus.Completed ? "#ecfdf5" : currentService?.status === ServiceStatus.Pending ? "#fff7ed" : "#f1f5f9",
                     color: currentService?.status === ServiceStatus.Completed ? "#16a34a" : currentService?.status === ServiceStatus.Pending ? "#b45309" : "#64748b"
                   }}>
                {currentService?.status ? ServiceStatus[currentService.status] : "—"}
              </div>
            </div>
          </div>

          {/* Stages list */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h4 className="font-semibold mb-3">Stages</h4>

            <div className="space-y-3">
              {stages.length === 0 && <div className="text-gray-500">No stages available</div>}

              {stages.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStageId(s.id)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition ${
                    s.id === selectedStageId ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-sm font-semibold">
                    {s.stage}
                  </div>
                  <div>
                    <div className="font-medium">{stageTitle(s.stage)}</div>
                    <div className="text-xs text-gray-400">
                      {s.status ? StageStatus[s.status] : "Unknown"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN: Stage details */}
        <main className="flex-1 bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-xl font-semibold">Stage: {selectedStage ? stageTitle(selectedStage.stage) : "—"}</h2>
              <div className="text-sm text-gray-500 mt-1">
                {selectedStage ? StageStatus[selectedStage.status] : ""}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Customer: {currentService?.customer?.firstName ? `${currentService.customer.firstName} ${currentService.customer.lastName}` : "—"}
            </div>
          </div>

          {/* Stage content area */}
          <div className="mt-6 grid grid-cols-3 gap-6">

            {/* Left: Stage main box */}
            <div className="col-span-2 bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Customer Invoice</h3>

              {/* Example: stage-specific attachments */}
              <div className="mb-4">
                {selectedStage && renderStageDocuments(selectedStage.documents)}
              </div>

              {/* Upload input */}
              <div className="mt-4">
                <label className="block text-sm mb-2">Upload Proof of Receipt</label>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    aria-label="Upload document"
                    onChange={(e) => setFileInput(e.target.files ? e.target.files[0] : null)}
                    className="border rounded p-2 text-sm"
                  />

                  <button
                    onClick={handleUpload}
                    disabled={uploading || !fileInput}
                    className="bg-teal-500 text-white px-4 py-2 rounded"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>

                {/* Comments */}
                <div className="mt-4">
                  <label className="block text-sm mb-2">Comments (if discrepancy):</label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Describe any inconsistencies..."
                    className="w-full border rounded p-3 min-h-[80px]"
                  />
                </div>

                <div className="mt-4 flex gap-3">
                  <button onClick={handlePostComment} className="bg-cyan-500 text-white px-4 py-2 rounded">Submit</button>
                  <button onClick={handleMarkStageCompleted} className="bg-gray-100 text-gray-700 px-4 py-2 rounded">Mark as Completed</button>
                </div>
              </div>
            </div>

            {/* Right: Attachments + Messages */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded border">
                <h4 className="font-semibold mb-2">Stage Attachments</h4>
                <div>{selectedStage ? renderStageDocuments(selectedStage.documents) : <div className="text-gray-500">No attachments</div>}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded border">
                <h4 className="font-semibold mb-2">Messages & Updates</h4>
                <div className="space-y-3">
                  {messages.length === 0 && <div className="text-gray-500">No messages yet</div>}
                  {messages.map((m) => (
                    <div key={m.id} className="bg-white p-3 rounded">
                      <div className="font-medium">{m.sender?.firstName ?? "User"}</div>
                      <div className="text-sm text-gray-700">{m.content}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(m.sentDate).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
