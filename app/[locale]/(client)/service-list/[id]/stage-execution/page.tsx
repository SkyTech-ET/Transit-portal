"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Upload,
  Input,
  Tag,
  Space,
  Card,
  Divider,
  Modal,
  message as antdMessage,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  FileTextOutlined,
  InboxOutlined,
  MessageOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useServiceStore } from "@/modules/mot/service/service.store";
import http from "@/modules/utils/axios";
import {
  IServiceStageExecution,
  ServiceStage,
  StageStatus,
  DocumentType,
  IStageDocument,
  RiskLevel,
  ServiceType
} from "@/modules/mot/service/service.types";
import useAuthStore from "@/modules/auth/auth.store";

import { useRouter } from "next/navigation";

const { TextArea } = Input;


const downloadFile = async (url: string, filename?: string) => {
  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch file");

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename || url.split("/").pop() || "file";
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (err: any) {
    console.error(err);
    antdMessage.error(err?.message || "Download failed");
  }
};


const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file); // This will give base64 string
  });
};


// optional: fetch a file from URL and convert to base64
const fetchFileAsBase64 = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const downloadBase64File = (base64: string, filename: string) => {
  const link = document.createElement("a");
  link.href = base64; // already contains data:mime;base64,...
  link.download = filename;
  link.click();
};


const riskConfig: Record<number, { label: string; color: string }> = {
  [RiskLevel.Blue]: { label: "Blue", color: "cyan" },
  [RiskLevel.Green]: { label: "Green", color: "green" },
  [RiskLevel.Yellow]: { label: "Yellow", color: "gold" },
  [RiskLevel.Red]: { label: "Red", color: "red" },
};

const getStageName = (stage?: ServiceStage) => {
  if (!stage) return "";
  return ServiceStage[stage]; // 🔑 reverse enum lookup
};






/**
 * Customer Workflow Page
 * - Timeline left column (vertical line + nodes)
 * - Stage cards with actions (buttons/ uploads)
 * - Floating right "Stage Details" card
 *
 * Matches screenshot styling: compact spacing, pill buttons, small tags, blue timeline line, stage cards.
 */

type Props = { params: { id: string } };

export default function CustomerWorkflowPage({ params }: Props) {
  const serviceId = Number(params.id);
  const router = useRouter();

  const { user } = useAuthStore();
  const customerUserId = user?.id;

  

  const { currentService, getServiceById, getServiceStages, downloadStageDocument, uploadCustomerStageDocument, getStageTransportsByStageId, stageTransports, stageTransportLoading, loading  } = useServiceStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [docStage, setDocStage] = useState<IServiceStageExecution | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedStageComments, setSelectedStageComments] = useState<
  { comment: string; createdDate: string; isVisibleToCustomer: boolean }[]
  >([]);



// At the top of your component

useEffect(() => {
  if (!serviceId || !customerUserId) return;

  console.log("🔥 Calling backend with serviceId:", serviceId);

  getServiceById(serviceId)
    .then((res: any) => {
      console.log("✅ getServiceById response:", res);

      if (res.stages?.length) {
        res.stages.forEach((stage: any) => {
          stage.documents = stage.documents?.map((d: any) => ({
            ...d,
            uploadedBy: d.uploadedByUserId === customerUserId ? "Customer" : "CaseExecutor",
          }));
        });
      }
    })
    .catch((err) => console.log("❌ getServiceById ERROR:", err));

  getServiceStages(serviceId)
    .then((res: any) => {
      console.log("✅ getServiceStages response:", res);

      if (res?.length) {
        res.forEach((stage: any) => {
          stage.documents = stage.documents?.map((d: any) => ({
            ...d,
            uploadedBy: d.uploadedByUserId === customerUserId ? "Customer" : "CaseExecutor",
          }));
        });
      }
      
    })
    .catch((err) => console.log("❌ getServiceStages ERROR:", err));
}, [serviceId, customerUserId]);


useEffect(() => {
  if (!currentService?.stages?.length) {
    console.log("❌ No stages yet in currentService");
    return;
  }

  console.log(
    "✅ All stage executions:",
    currentService.stages.map((s) => ({
      id: s.id,
      stage: s.stage,
    }))
  );

  const transportationExec = currentService.stages.find(
    (s) => s.stage === ServiceStage.Transportation
  );

  console.log("🚚 Transportation stage execution:", transportationExec);

  if (transportationExec?.id) {
    console.log(
      "📡 Calling transport API with ServiceStageId:",
      transportationExec.id
    );
    getStageTransportsByStageId(transportationExec.id);
  } else {
    console.log("❌ Transportation stage NOT found");
  }
}, [currentService?.stages]);







  const stages: IServiceStageExecution[] = currentService?.stages ?? [];

  const isMultimodal = currentService?.serviceType === ServiceType.Multimodal;

  const displayedStages: IServiceStageExecution[] = stages.filter((s) => {
  if (!isMultimodal) return true;

  //  Remove these for multimodal
  return (
    s.stage !== ServiceStage.LocalPermission &&
    s.stage !== ServiceStage.Arrival
  );
});

  // order & labels to match screenshot
  const stageOrder = useMemo(() => {
  const order = [
    ServiceStage.PrepaymentInvoice,
    ServiceStage.TransitPermission,
    ServiceStage.Amendment,
    ServiceStage.DropRisk,
    ServiceStage.DeliveryOrder,
    ServiceStage.WarehouseStatus,
    ServiceStage.Inspection,
    ServiceStage.AssessmentandTaxPayment,
    ServiceStage.Emergency,
    ServiceStage.ExitandStoragePayment,
    ServiceStage.Transportation,
    ServiceStage.LocalPermission,
    ServiceStage.Arrival,
    ServiceStage.Clearance,
  ];

  if (currentService?.serviceType === ServiceType.Multimodal) {
    // ❌ remove 12 & 13
    return order.filter(
      (s) =>
        s !== ServiceStage.LocalPermission &&
        s !== ServiceStage.Arrival
    );
  }

  return order;
}, [currentService?.serviceType]);

  const stageLabels = [
    "Prepayment Invoice",
    "TransitPermission",
    "Amendment",
    "Drop Risk",
    "Delivery Order",
    "Warehouse Status",
    "Inspection",
    "Assessment & Tax Payment",
    "Spot",
    "Exit & Storage Payment",
    "Transportation",
    "Local Permission",
    "Arrival",
    "Clearance",
    "Settlement",
  ];


  const BASE_URL = "https://transitportal.skytechet.com";
  

  const findStageExec = (stageEnum: ServiceStage) =>
    displayedStages.find((s) => s.stage === stageEnum) ?? null;

  const uploadCustomerFile = async (
    stageExec: IServiceStageExecution | null,
    docType: DocumentType = DocumentType.Other,
    description?: string
  ) => {
    if (!stageExec) {
      antdMessage.warning("Select stage first.");
      return;
    }
    if (!selectedFile) {
      antdMessage.warning("Choose file first.");
      return;
    }
    

    setUploading(true);
    try {

      // Convert the file to Base64
    const base64Content = await fileToBase64(selectedFile);

    // Update the stageExec.documents in local state
    // Create the new document object (For frontend only )
  const newDoc: IStageDocument = {
  id: Date.now(), // temporary ID
  serviceStageId: stageExec!.id,
  fileName: selectedFile.name,
  filePath: "", // frontend only
  originalFileName: selectedFile.name,
  fileExtension: "." + selectedFile.name.split(".").pop(),
  fileSize: selectedFile.size,
  contentType: selectedFile.type,
  documentType: DocumentType.Other,
  uploadedByUserId: 0, // dummy userId
  isRequired: false,
  isVerified: false,
  uploadedDate: new Date().toISOString(),
  

  uploadedBy: "Customer",

};

    

    stageExec.documents = stageExec.documents
      ? [...stageExec.documents, newDoc]
      : [newDoc];

    antdMessage.success("File uploaded locally (frontend)");
    setSelectedFile(null);


    // If you still want to call backend for storage:
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("documentType", String(docType));
      fd.append("isVisibleToExecutor", "true");
      if (description) fd.append("description", description);

      // adjust path if your backend expects a different route for customer uploads
      const url = `/Customer/services/${serviceId}/stages/${stageExec.id}/documents`;
      await http.post({ url, data: fd });


      // Refresh stages from backend if needed

      antdMessage.success("File uploaded");
      setSelectedFile(null);
      await getServiceStages(serviceId);
      await getServiceById(serviceId);

    } catch (err: any) {
      console.error(err);
      antdMessage.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };


  const handleCustomerUpload = async (
  stageExecId: number,
  file: File
) => {
  if (!currentService) return;

  await uploadCustomerStageDocument(
    currentService.id,
    stageExecId,
    file,
    DocumentType.Invoice 
  );
};



//Normal
/* const handleViewComments = (stageExec: IServiceStageExecution | null) => {
  if (!stageExec) return;

  const comments = stageExec.stageComments ?? [];
  setSelectedStageComments(comments);
  setCommentsModalOpen(true);
}; */

//For UnseenComments

const handleViewComments = (exec: any) => {
  if (!exec?.stageComments) return;

  setSelectedStageComments(exec.stageComments);
  setCommentsModalOpen(true);

  // 🔹 mark comments as seen locally (UI-level)
  exec.stageComments.forEach((c: any) => {
    if (c.isVisibleToCustomer) {
      c.isSeenByCustomer = true;
    }
  });
};



const hasUnseenComments = (exec: any) => {
  if (!exec?.stageComments || exec.stageComments.length === 0) return false;

  return exec.stageComments.some(
    (c: any) => c.isVisibleToCustomer && c.isSeenByCustomer === false
  );
};




  const postCustomerComment = async (stageExec: IServiceStageExecution | null, text: string) => {
    if (!stageExec) {
      antdMessage.warning("Select a stage");
      return;
    }
    if (!text.trim()) {
      antdMessage.warning("Enter a message");
      return;
    }
    setSending(true);
    try {
      const url = `/Customer/services/${serviceId}/stages/${stageExec.id}/comments`;
      await http.post({
        url,
        data: {
          Comment: text,
          CommentType: null,
          IsInternal: false,
          IsVisibleToCustomer: true,
        },
      });
      antdMessage.success("Message sent");
      setMessageText("");
      await getServiceById(serviceId);
      await getServiceStages(serviceId);
    } catch (err: any) {
      console.error(err);
      antdMessage.error(err?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

   const renderDocsForStage = (stageExec: IServiceStageExecution | null) => {
  if (!stageExec || !stageExec.documents || stageExec.documents.length === 0) {
    return <div className="text-gray-400 text-sm">No attachments</div>;
  }

  return stageExec.documents.map((d) => {
  const ext = d.fileExtension?.toLowerCase();
  const previewAvailable = /\.(jpg|jpeg|png|gif|pdf)$/i.test(ext ?? "");

  return (
    <div key={d.id} className="flex flex-col bg-white rounded-md p-2 mb-2 border">
      <div className="flex justify-between items-center mb-1">
        <div className="font-medium text-sm">{d.originalFileName ?? d.fileName}</div>
        <Tag color={d.uploadedBy === "Customer" ? "green" : "blue"}>
          {d.uploadedBy === "Customer" ? "Document from Customer" : "Document from Case Executor"}
        </Tag>
      </div>
      {previewAvailable ? (
        <div className="text-xs text-gray-500 mb-2">Preview available after download</div>
      ) : (
        <div className="text-xs text-gray-400 mb-2">Preview not available</div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">{/* {new Date(d.uploadedDate).toLocaleString()} */}</div>
        {
  d.filePath ? (() => {
    // Normalize Windows backslashes → URL format
    const fileUrl = `${BASE_URL}/${d.filePath.replace(/\\/g, "/")}`;

    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        View
      </a>
    );
  })() : (
    <span>No File</span>
  )
}
      </div>
    </div>
  );
});

};
 



  /* const renderDocsForStage = (stageExec: IServiceStageExecution | null) => {
  if (!stageExec || !stageExec.documents || stageExec.documents.length === 0) {
    return <div className="text-gray-400 text-sm">No attachments</div>;
  }

  return stageExec.documents.map((d: IStageDocument & { base64Content?: string }) => {
    // compute correct URL for backend files
    const previewUrl = d.base64Content
      ? d.base64Content // frontend-uploaded file
      : d.filePath.startsWith("/")
        ? `${window.location.origin}${d.filePath}` // backend file absolute URL
        : d.filePath;

    const ext = d.fileExtension?.toLowerCase();

    let preview;
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".gif") {
      preview = <img src={previewUrl} alt={d.originalFileName} className="max-w-full max-h-96 mb-2 rounded" />;
    } else if (ext === ".pdf") {
      preview = <iframe src={previewUrl} width="100%" height="400px" className="mb-2" />;
    } else {
      preview = <div className="text-sm text-gray-500">Preview not available</div>;
    }

    return (
      <div key={d.id} className="flex flex-col bg-white rounded-md p-2 mb-2 border">
        {preview}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">{d.originalFileName ?? d.fileName}</div>
            <div className="text-xs text-gray-500">{new Date(d.uploadedDate).toLocaleString()}</div>
          </div>
          <div>
            {d.base64Content && (
              <Button
                type="link"
                onClick={() => downloadBase64File(d.base64Content!, d.originalFileName)}
                className="text-blue-600 text-sm"
              >
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  });
}; */




  const StatusTag = ({ status }: { status?: StageStatus }) => {
    if (status === StageStatus.Completed) return <Tag color="blue">Completed</Tag>;
    if (status === StageStatus.InProgress) return <Tag color="cyan">In Progress</Tag>;
    if (status === StageStatus.Pending) return <Tag color="orange">Pending</Tag>;
    return <Tag>Not started</Tag>;
  };

  // compute progress percent for top progress bar (approx)
 const progressPercent = useMemo(() => {
  if (!stages || stages.length === 0) return 0;
  const completedCount = displayedStages.filter(s => s.status === StageStatus.Completed).length;
  return Math.round((completedCount / stageOrder.length) * 100);
}, [stages, stageOrder]);


  // small timeline dot renderer (blue line + nodes)
  const TimelineDot = ({ status }: { status?: StageStatus }) => {
    const isComplete = status === StageStatus.Completed;
    const bg = isComplete ? "#2563eb" : "#fff";
    const border = isComplete ? "2px solid #2563eb" : "2px solid #cbd5e1";
    const color = isComplete ? "#fff" : "#2563eb";
    return (
      <div style={{ width: 18, height: 18, borderRadius: 18, background: bg, border, color }} className="flex items-center justify-center text-xs font-semibold">
        {isComplete ? "✓" : ""}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-[1200px] mx-auto relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Service Requests</h1>
          <div className="text-sm text-gray-500">Service Workflow Timeline</div>
        </div>

        {showComments && (
          <div className="mt-4 border rounded p-4 bg-gray-50">
    <h3 className="font-semibold mb-2">Case Executor Comments</h3>

    {selectedStageComments.length === 0 ? (
      <p className="text-gray-500">No comments found</p>
    ) : (
      selectedStageComments.map((c, index) => (
        <div key={index} className="mb-3 p-2 border rounded bg-white">
          <p className="text-sm text-gray-800">{c.comment}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(c.createdDate).toLocaleString()}
          </p>
        </div>
      ))
    )}
        </div>
)}


        {/* top progress bar */}
        <div className="mb-6">
          <div className="relative h-2 w-full bg-gray-200 rounded-full">
            <div
              style={{ width: `${progressPercent}%`, background: "#2563eb" }}
              className="absolute left-0 top-0 h-2 rounded-full"
            />
          </div>
          <div className="text-xs text-gray-500 mt-2">{progressPercent}% Complete</div>
        </div>

        <div className="flex gap-6">
          {/* LEFT: timeline column */}
          <div className="flex-1">
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-blue-100" />

              <div className="space-y-6">
                {stageOrder.map((stage, idx) => {
                  const exec = findStageExec(stage);
                  const status = exec?.status;

                  if (stage === ServiceStage.DropRisk) {
                    console.log("🔍 Customer DropRisk exec:", exec);
                    console.log("🔍 Risk level:", exec?.riskLevel);
                  }

                  

                  return (
                    <div key={String(stage)} className="pl-12 relative">
                      {/* Node + card */}
                      <div className="absolute left-0 top-1">
                        <TimelineDot status={status} />
                      </div>

                      <div className="bg-white rounded-md p-4 border">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="font-semibold text-[#1D4ED8]">{stageLabels[idx]}</div>
                              <div className="text-xs text-gray-500">{exec?.notes ?? ""}</div>
                            </div>

                            <div className="mt-3 space-y-2">


                              {/* Specific actions per stage to match screenshot */}

                              {stage === ServiceStage.PrepaymentInvoice && (
                                <div className="flex flex-wrap gap-2 items-center">
                                  {/* <Button icon={<FileTextOutlined />}>View Invoice</Button> */}

                                  {exec && (
                                    <>
                                    {/* hidden file input */}
                                      <input
                                        type="file"
                                        id={`upload-${exec.id}`}
                                        hidden
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                              if (!file) return;

                                                uploadCustomerStageDocument(
                                                  serviceId,
                                                  exec.id,
                                                  file,
                                                  DocumentType.Other
                                                );
                                          }}
                                      />

  {/* visible button */}
  <button
    className="
    flex items-center gap-2
    px-4 py-2
    rounded
    border
    bg-[#F0FDF4]
    border-[#BBF7D0]
    text-[#15803D]
    hover:bg-[#DCFCE7]
    transition
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
    onClick={() =>
      document.getElementById(`upload-${exec.id}`)?.click()
    }
    disabled={loading}
  >
    <UploadOutlined style={{ color: "#15803D" }} />
    Upload Bank Receipt
  </button>
</>

)}



                                  <Button icon={<EyeOutlined />} onClick={() => {setDocStage(exec); setDocsOpen(true);}}>
                                    View Invoice
                                  </Button>

                                  <button
                                      onClick={() => {
                                        console.log("Clicked exec:", exec);
                                        handleViewComments(exec)
                                      }} 
                                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"  

                                      //For unseen comments button style:
                                      /* className={`px-4 py-2 rounded border transition
                                        ${
                                            hasUnseenComments(exec)
                                             ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`} */

                                        

                              
                                    > 
                                      View Comments
                                    </button>

                                </div>
                                
                              )}

                             {stage === ServiceStage.DropRisk && (() => {
  const riskLevel = currentService?.riskLevel;

  console.log("🔍 Customer DropRisk exec:", exec);
  console.log("🔍 Service risk level:", riskLevel);

  if (!riskLevel || !riskConfig[riskLevel]) {
    return <Tag color="default">Not Assessed</Tag>;
  }

  const { label, color } = riskConfig[riskLevel];

  return (
    <div className="flex items-center gap-2">
      <Tag color={color}>{label}</Tag>
      {/* <Button size="small" onClick={() => antdMessage.info("View risk details")}>
        View Details
      </Button> */}
    </div>
  );
})()}



                              {stage === ServiceStage.DeliveryOrder && (
                                <div className="flex items-center gap-2">
  <Button
  icon={<EyeOutlined /* style={{ color: "#1D4ED8" }} */ />}
  onClick={() => {
    setDocStage(exec);
    setDocsOpen(true);
  }}
  /* style={{
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderWidth: 1,
    color: "#1D4ED8",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    fontSize: 16,
    display: "flex",
    alignItems: "center",
  }} */
>
  View Documents
</Button>


                                </div>
                              )}

                              {stage === ServiceStage.TransitPermission && (
                                <div className="flex items-center gap-2">
                                  <Button icon={<EyeOutlined />} onClick={() => {setDocStage(exec); setDocsOpen(true);}}>
                                    View Documents
                                  </Button>
                                </div>
                              )}

                              {stage === ServiceStage.Amendment && (
                                <div className="flex items-center gap-2">
  <Button
  icon={<EyeOutlined /* style={{ color: "#1D4ED8" }} */ />}
  onClick={() => {
    setDocStage(exec);
    setDocsOpen(true);
  }}
>
  View Documents
</Button>


                                </div>
                              )}


                              {stage === ServiceStage.WarehouseStatus && (
                                <div className="flex items-center gap-2">
                                  <Button icon={<EyeOutlined />} onClick={() => {setDocStage(exec); setDocsOpen(true);}}>
                                    View Photo of Item (On-Site)
                                  </Button>
                                  <button
                                      onClick={() => handleViewComments(exec)}
                                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    > 
                                      View Settlement Notes
                                    </button>
                                </div>
                              )}

                              {stage === ServiceStage.Inspection && (
                                <div className="flex flex-wrap gap-2 items-center">
                                    <button
                                      onClick={() => handleViewComments(exec)}
                                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    > 
                                      View Comments
                                    </button>

                                  <Button icon={<EyeOutlined />} onClick={() => {setDocStage(exec); setDocsOpen(true);}}>
                                    View Documents
                                  </Button>
                                  <Button type="primary" onClick={() => antdMessage.success("Agreed to continue")}>Agree to Continue</Button>

                                  {exec && (
                                    <>
                                    {/* hidden file input */}
                                      <input
                                        type="file"
                                        id={`upload-${exec.id}`}
                                        hidden
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                              if (!file) return;

                                                uploadCustomerStageDocument(
                                                  serviceId,
                                                  exec.id,
                                                  file,
                                                  DocumentType.Other
                                                );
                                          }}
                                      />

  {/* visible button */}
  <button
    className="px-4 py-2 border rounded bg-white hover:bg-gray-100"
    onClick={() =>
      document.getElementById(`upload-${exec.id}`)?.click()
    }
    disabled={loading}
  >
    Upload 2nd Invoice
  </button>
</>

)}
                                </div>
                              )}

                              {stage === ServiceStage.Emergency && (
                                <div className="flex items-center gap-2">
                                  {/* <Button danger onClick={() => antdMessage.info("Read message from customers")}>Read Message</Button> */}
                                  <button
                                        onClick={() => {
                                        console.log("Clicked exec:", exec);
                                        handleViewComments(exec)
                                      }} 
                                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"  
                                    > 
                                      View Comments
                                    </button>
                                </div>
                              )}

                              {stage === ServiceStage.ExitandStoragePayment && (
                                <div className="flex items-center gap-2">
                                  {/* <Button onClick={() => antdMessage.info("View Receipt")}>View Receipt</Button> */}
                                  <Button icon={<EyeOutlined />} onClick={() => {setDocStage(exec); setDocsOpen(true);}}>
                                    View Receipt
                                  </Button>
                                </div>
                              )}

                              

                              {stage === ServiceStage.Transportation && (
  <div className="space-y-2 text-sm text-gray-700">
    {stageTransportLoading ? (
      console.log("🖥️ stageTransports in UI:", stageTransports),
      <div className="text-gray-400">Loading transportation data…</div>
    ) : stageTransports.length === 0 ? (
      <div className="text-gray-400">No transport assigned yet</div>
    ) : (
      stageTransports.map((t) => (
        <div
          key={t.id}
          className="border rounded-md p-3 bg-gray-50"
        >
          <div><b>Driver:</b> {t.fullName}</div>
          <div><b>Plate:</b> {t.plateNumber}</div>
          <div><b>Phone Number:</b> {t.phoneNumber}</div>
          <div>
            <b>Product Amount:</b> {t.productAmount}{/*  (Unit {t.productUnit}) */}
          </div>
          <div className="text-xs text-gray-500">
            Assigned on {new Date(t.startDate).toLocaleString()}
          </div>
        </div>
      ))
    )}
  </div>
)}


                              {stage === ServiceStage.LocalPermission && (
                                <div className="flex items-center gap-2">
                                  <Button icon={<EyeOutlined />} onClick={() => {setDocStage(exec); setDocsOpen(true);}}>
                                    View Details
                                  </Button>
                                </div>
                              )}

                              {stage === ServiceStage.Arrival && (
                                <div>
                                  <div className="text-sm text-gray-500">View Photo Proof</div>
                                  <div className="mt-2">
                                    <Button icon={<EyeOutlined />} onClick={() => {setDocStage(exec); setDocsOpen(true);}}>
                                    View Photo Proof
                                  </Button>
                                  </div>
                                </div>
                              )}

                              {stage === ServiceStage.Clearance && (
                                <div className="flex items-center gap-2">
                                  <Button icon={<EyeOutlined />} onClick={() => {setDocStage(exec); setDocsOpen(true);}}>
                                    View Clearance Documents
                                  </Button>
                                </div>
                              )}

                              {/* {stage === ServiceStage.Settlement && (
                                <div className="flex items-center gap-2">
                                  <Button onClick={() => antdMessage.info("View photo proof")}>View Photo Proof</Button>
                                </div>
                              )} */}
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <StatusTag status={status} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: stage details card */}
          <div style={{ width: 340 }} className="hidden lg:block">
            <Card
              style={{
                position: "sticky",
                top: 24,
                borderRadius: 12,
                boxShadow: "0 8px 30px rgba(16,24,40,0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-base">Stage Details</div>
                <div className="text-xs text-gray-400">View</div>
              </div>

              <Divider style={{ margin: "8px 0" }} />

              <div className="space-y-3">
                {/* replicate the styles and order in screenshot */}
                <div className="flex items-start gap-3">
                  <div style={{ width: 8, height: 8, borderRadius: 8, background: "#0ea5e9" }} />
                  <div>
                    <div className="font-medium text-sm">Prepayment Invoice</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{ width: 8, height: 8, borderRadius: 8, background: "#10b981" }} />
                  <div>
                    <div className="font-medium text-sm">Drop Risk</div>
                    <div className="text-xs text-gray-500">Risk level: Low</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{ width: 8, height: 8, borderRadius: 8, background: "#f59e0b" }} />
                  <div>
                    <div className="font-medium text-sm">Delivery Order</div>
                    <div className="text-xs text-gray-500">Docs received</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{ width: 8, height: 8, borderRadius: 8, background: "#10b981" }} />
                  <div>
                    <div className="font-medium text-sm">Inspection</div>
                    <div className="text-xs text-gray-500">Customer confirmed</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{ width: 8, height: 8, borderRadius: 8, background: "#06b6d4" }} />
                  <div>
                    <div className="font-medium text-sm">Transportation</div>
                    <div className="text-xs text-gray-500">Driver assigned</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{ width: 8, height: 8, borderRadius: 8, background: "#7c3aed" }} />
                  <div>
                    <div className="font-medium text-sm">Clearance</div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{ width: 8, height: 8, borderRadius: 8, background: "#ef4444" }} />
                  <div>
                    <div className="font-medium text-sm">Store Settlement</div>
                    <div className="text-xs text-gray-500">Waiting</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* bottom small gap */}
        <div className="h-8" />
      </div>

      {/* Floating small helper on mobile: upload preview */}
      <div className="fixed right-6 bottom-6 hidden md:block">
        <Card size="small" style={{ borderRadius: 10 }}>
          <div className="flex items-center gap-2">
            <UploadOutlined />
            <div className="text-sm">{selectedFile ? selectedFile.name : "No file selected"}</div>
          </div>
        </Card>
      </div>

       {/* MODAL for stage documents */}
      <Modal
        title={`Documents for ${getStageName(docStage?.stage)}`}
        open={docsOpen}
        onCancel={() => setDocsOpen(false)}
        footer={null}
      >
        {renderDocsForStage(docStage)}
      </Modal>

      <Modal
  title="Case Executor Comments"
  open={commentsModalOpen}
  onCancel={() => setCommentsModalOpen(false)}
  footer={null}
  width={600}
>
  {selectedStageComments.length === 0 ? (
    <p className="text-gray-500">No comments found</p>
  ) : (
    selectedStageComments.map((c, index) => (
      <div key={index} className="mb-3 p-2 border rounded bg-white">
        <p className="text-sm text-gray-800">{c.comment}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(c.createdDate).toLocaleString()}
        </p>
      </div>
    ))
  )}
</Modal>


    </div>

  );

}
