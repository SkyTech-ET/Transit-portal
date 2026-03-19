"use client";

import React, { useEffect, useState, useMemo  } from "react";
import { Button, Upload, Input, Space, message as antdMessage } from "antd";
import { UploadOutlined, LikeOutlined, LockOutlined, BellOutlined, WarningOutlined } from "@ant-design/icons";
import { useServiceStore } from "@/modules/mot/service/service.store";
import http from "@/modules/utils/axios";
import { IServiceStageExecution, StageStatus, ServiceStage, DocumentType, RiskLevel, IStageDocument, ServiceType } from "@/modules/mot/service/service.types";
import { useRouter } from "next/navigation";
import useAuthStore from "@/modules/auth/auth.store";
import { Modal, Select } from "antd";

const { TextArea } = Input;

type Props = { params: { id: string } };

export default function StageExecutionPage({ params }: Props) {
  const serviceId = Number(params.id);
  const router = useRouter();

  const { 
    currentService, 
    getServiceById, 
    getServiceStages, 
    getAssignedServiceById, 
    updateStageStatus, 
    uploadStageDocument, 
    downloadStageDocument, 
    setRiskLevel, 
    addStageComment,
    createStageTransport  } = useServiceStore();

  const [stageFiles, setStageFiles] = useState<Record<number, File | null>>({});
  const [stageComments, setStageComments] = useState<Record<number, string>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [docsModalVisible, setDocsModalVisible] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<IStageDocument[]>([]);
  const [selectedStageTitle, setSelectedStageTitle] = useState("");
  const [riskSelections, setRiskSelections] = useState<Record<number, RiskLevel | null>>({});

  const riskColorMap: Record<RiskLevel, string> = {
  [RiskLevel.Blue]: "#06b6d4",
  [RiskLevel.Green]: "#16a34a",
  [RiskLevel.Yellow]: "#ca8a04",
  [RiskLevel.Red]: "#dc2626",
};


// Transportation form state
const [fullName, setFullName] = useState("");
const [plateNumber, setPlateNumber] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [productUnit, setProductUnit] = useState("");
const [productAmount, setProductAmount] = useState<number | null>(null);
const [licenceFile, setLicenceFile] = useState<File | null>(null);



const submitTransport = async (stageExec: IServiceStageExecution) => {
  if (!stageExec) return;

  const fd = new FormData();
  fd.append("FullName", fullName);
  fd.append("PlateNumber", plateNumber);
  fd.append("PhoneNumber", phoneNumber);
  fd.append("ProductUnit", productUnit);
  fd.append("ProductAmount", String(productAmount ?? 0));
  fd.append("ServiceStageId", String(stageExec.id));

  if (licenceFile) {
    fd.append("LicenceDocumentImage", licenceFile);
  }

  await createStageTransport(fd);

  antdMessage.success("Transportation saved");

  // refresh stages so meta comes back
  await getServiceStages(serviceId);
};

const { user } = useAuthStore();

useEffect(() => {
  if (!serviceId || !user?.id) return;

  const role = user.roles?.[0]?.roleName;

  getServiceStages(serviceId);

  const load = async () => {
    let service;
    if (role === "caseExecutor") {
      service = await getAssignedServiceById(serviceId, user.id);
    } else {
      service = await getServiceById(serviceId);
    }

    await getServiceStages(serviceId);

// ✅ work with store data
const stages = currentService?.stages ?? [];

stages.forEach((stage: any) => {
  stage.documents = stage.documents?.map((d: any) => ({
    ...d,
    uploadedBy: d.uploadedByUserId === user?.id ? "CaseExecutor" : "Customer",
  }));
});

  };

  load();
}, [serviceId, user?.id]);

  const stages: IServiceStageExecution[] = currentService?.stages ?? [];

  const findStageExec = (stageEnum: ServiceStage) =>
    displayedStages.find((s) => s.stage === stageEnum) ?? null;

  const isMultimodal = currentService?.serviceType === ServiceType.Multimodal;

// Filter stages for display
const displayedStages: IServiceStageExecution[] = stages.filter((s) => {
  if (!isMultimodal) return true; // show all for unimodal
  return s.stage !== ServiceStage.LocalPermission && s.stage !== ServiceStage.Arrival; // skip 12 & 13 for multimodal
});



const uploadStageFile = async (stageEnum: ServiceStage) => {
  if (uploading) return;
  const stageExec = findStageExec(stageEnum);
  const file = stageFiles[stageEnum];
  if (!stageExec || !file) return;

  setUploading(true);
  try {
    await uploadStageDocument(
      serviceId,
      stageExec.id, // execution ID
      file,
      DocumentType.Other
    );

    // Clear after upload
    setStageFiles(prev => ({ ...prev, [stageEnum]: null }));
  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);
  }
};

  const postStageComment = async (stageEnum: ServiceStage) => {
    const stageExec = findStageExec(stageEnum);
    const comment = stageComments[stageEnum] || "";
    const file = stageFiles[stageEnum];

    if (!stageExec) return;

    setSaving(true);

    try {
    // 1️⃣ Upload document IF selected
      if (file) {
        const fd = new FormData();
        fd.append("serviceId", String(serviceId));
        /* fd.append("stageId", String(stageExec.stage)); // ✅ ENUM, NOT ID */
        fd.append("stageId", String(stageExec.id)); // use execution ID
        fd.append("documentType", String(DocumentType.Other));
        fd.append("File", file);


  await http.post({
    url: "/CaseExecutor/UploadStageDocument",
    data: fd,
  });

  console.log("✅ Document uploaded successfully");
}


    // 2️⃣ Save comment
    if (comment.trim()) {
      await addStageComment(
        serviceId,
        stageExec.id,        // ✅ execution ID
        stageComments[stageEnum],
        false,               // isInternal
        true                 // isVisibleToCustomer
      );
    }


    // 3️⃣ Update stage status
    await updateStageStatus(stageExec.id, StageStatus.Completed);

    // 4️⃣ Refresh
    await getServiceStages(serviceId);
    await getServiceById(serviceId);

    // 5️⃣ Cleanup
    setStageFiles(prev => ({ ...prev, [stageEnum]: null }));
    setStageComments(prev => ({ ...prev, [stageEnum]: "" }));

    antdMessage.success("Stage saved successfully");
    
  } catch (err: any) {
    console.error(err);
    antdMessage.error("Failed to save stage");
  } finally {
    setSaving(false);
  }
};

  const stageOrder = [
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

  const filteredStageOrder = useMemo(() => {
  if (currentService?.serviceType === ServiceType.Multimodal) {
    return stageOrder.filter(
      (s) =>
        s !== ServiceStage.LocalPermission &&
        s !== ServiceStage.Arrival
    );
  }

  return stageOrder;
}, [currentService?.serviceType]);


  const stageLabelMap: Record<ServiceStage, string> = {
  [ServiceStage.PrepaymentInvoice]: "Prepayment Invoice",
  [ServiceStage.TransitPermission]: "Transit Permission",
  [ServiceStage.Amendment]: "Amendment",
  [ServiceStage.DropRisk]: "Drop Risk",
  [ServiceStage.DeliveryOrder]: "Delivery Order",
  [ServiceStage.WarehouseStatus]: "Warehouse Status",
  [ServiceStage.Inspection]: "Inspection",
  [ServiceStage.AssessmentandTaxPayment]: "Assessment & Tax Payment",
  [ServiceStage.Emergency]: "Spot",
  [ServiceStage.ExitandStoragePayment]: "Exit & Storage Payment",
  [ServiceStage.Transportation]: "Transportation",
  [ServiceStage.LocalPermission]: "Local Permission",
  [ServiceStage.Arrival]: "Arrival",
  [ServiceStage.Clearance]: "Clearance",
};


  const StageHeader = ({ number, title, color }: { number: number; title: string; color?: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: color ?? "#3b82f6",
        color: "#fff",
        fontWeight: 700,
      }}>{number}</div>
      <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
    </div>
  );


const renderDocsForStage = (stageExec: IServiceStageExecution | null, stageTitle: string) => {
  if (!stageExec || !stageExec.documents || stageExec.documents.length === 0) {
    return <div style={{ color: "#6a7280" }}>No attachments</div>;
  }

  return (
    <Button
      onClick={() => {
        setSelectedDocs(stageExec.documents!);
        setSelectedStageTitle(stageTitle);
        setDocsModalVisible(true);
      }}
    >
      View Documents ({stageExec.documents.length})
    </Button>
  );
};

  return (
    <div style={{ padding: 28, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h1>Stage Execution</h1>
        <Button onClick={() => router.back()}>Back</Button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 32, display: "flex", gap: 10 }}>
        {displayedStages.map((stageExec, idx) => {
  const isCompleted = stageExec.status === StageStatus.Completed;
  const isCurrent = stageExec.stage === currentService?.currentStage;


          return (
            <div key={stageExec.stage} style={{ textAlign: "center" }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isCompleted ? "#3b82f6" : isCurrent ? "#2563eb" : "#e5e7eb",
                color: isCompleted || isCurrent ? "#fff" : "#6b7280",
                fontWeight: 600,
                fontSize: 14,
                border: "2px solid #d1d5db",
              }}>{isCompleted ? "✓" : idx + 1}</div>
              <div style={{ marginTop: 6, fontSize: 12 }}>{stageLabelMap[stageExec.stage]}</div>
            </div>
          );
        })}
      </div>

      {/* Stage Blocks */}
      {filteredStageOrder.map((stage, idx) => {
        const stageExec = findStageExec(stage);
        const isInspection = stage === ServiceStage.Inspection;
        const isPrepaymentInvoice = stage === ServiceStage.PrepaymentInvoice;
        const isSpot = stage === ServiceStage.Emergency;
        const isExit = stage === ServiceStage.ExitandStoragePayment;
        const isDeliveryOrder = stage === ServiceStage.DeliveryOrder;


        return (
          <section key={stage} style={{ padding: 18, borderRadius: 8, marginBottom: 18, border: "1px solid #eef2f7" }}>
            <StageHeader number={idx + 1} title={stageLabelMap[stage]}/>

            
            {isSpot && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr auto auto",
      gap: 16,
      alignItems: "center",
      marginBottom: 24,
    }}
  >
    {/* Left: Critical Updates / Comments */}
    <div>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Critical Updates / Comments
      </div>
      <TextArea
        style={{borderColor: "#FCA5A5" }}
        placeholder="Add urgent customs comments..."
        rows={2}
        value={stageComments[stage] || ""}
        onChange={(e) =>
          setStageComments((prev) => ({
            ...prev,
            [stage]: e.target.value,
          }))
        }
      />
    </div>

    {/* Middle: Mark as Released */}
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Mark as Released
      </div>
      <Button
        style={{
          backgroundColor: "#E0EDFF",
          borderColor: "#93C5FD",
          color: "#1D4ED8",
          fontWeight: 600,
          minWidth: 140,
        }}
        onClick={async () => {
          if (!stageExec) return;
          await updateStageStatus(stageExec.id, StageStatus.Completed);
          antdMessage.success("Marked as Released");
        }}
      >
        🔓 Released
      </Button>
    </div>

    {/* Right: Urgent Manager Notification */}
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Urgent Manager Notification
      </div>
      <Button
        danger
        style={{
          backgroundColor: "#FEE2E2",
          borderColor: "#FCA5A5",
          fontWeight: 600,
          minWidth: 120,
        }}
        onClick={() => {
          antdMessage.warning("Manager notified");
        }}
      >
        🚨 Notify
      </Button>
    </div>
  </div>
)}


{stage === ServiceStage.Transportation && stageExec && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
      marginBottom: 24,
    }}
  >
    <Input
      placeholder="Driver Full Name"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
    />

    <Input
      placeholder="Car Plate Number"
      value={plateNumber}
      onChange={(e) => setPlateNumber(e.target.value)}
    />

    <Upload
      beforeUpload={(file) => {
        setLicenceFile(file);
        return false;
      }}
      maxCount={1}
    >
      <Button>Choose Licence</Button>
    </Upload>

    <Input
      placeholder="Phone Number"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
    />

    <Input
      placeholder="Product Unit"
      value={productUnit}
      onChange={(e) => setProductUnit(e.target.value)}
    />

    <Input
      type="number"
      placeholder="Product Amount"
      value={productAmount ?? ""}
      onChange={(e) => setProductAmount(Number(e.target.value))}
    />

    <Button
      type="primary"
      onClick={() => submitTransport(stageExec)}
    >
      Save Transportation
    </Button>
  </div>
)}

{stage === ServiceStage.Clearance && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16,
      marginBottom: 24,
    }}
  >
    {/* Customer Requested Docs */}
    <div>
      <div style={{ marginBottom: 6 }}>Customer Requested Docs?</div>
      <Select
        defaultValue="No"
        style={{ width: "100%" }}
        options={[
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ]}
      />
    </div>

    {/* Upload Cleared Documents */}
    <div>
      <div style={{ marginBottom: 6 }}>Upload Cleared Documents</div>
      <Upload beforeUpload={() => false} maxCount={1}>
        <Button>Choose file</Button>
      </Upload>
    </div>

  </div>
)}


{ stage !== ServiceStage.DropRisk && 
  stage !== ServiceStage.Emergency &&
  stage !== ServiceStage.Transportation &&
  stage !== ServiceStage.Clearance && (
  <div style={{ marginBottom: 24 }}>
    <div style={{ marginBottom: 12 }}>
      { stage === ServiceStage.WarehouseStatus  
        ? "Photo of item (on-site)"
        : isInspection ? "Attach inspection document"
        : isPrepaymentInvoice ? "Upload Proof of Receipt"
        : isExit ? "Upload Storage Fee Receipt"
        : isDeliveryOrder ? "Upload DO Document"
        : "Upload Document"}
    </div>

    {/* 🔹 ONE ROW */}
    <Space wrap>
      {/* Main upload */}
      <Upload
        beforeUpload={(f) => {
          const realFile = (f as any).originFileObj ?? f;
          setStageFiles(prev => ({ ...prev, [stage]: realFile }));
          return false;
        }}
        maxCount={1}
        showUploadList
      >
        <Button icon={<UploadOutlined />}>Choose file</Button>
      </Upload>

      <Button
        type="primary"
        disabled={!stageFiles[stage]}
        loading={uploading}
        onClick={() => uploadStageFile(stage)}
      >
        Upload
      </Button>



      {/* 🔹 INSPECTION ONLY */}
      {isInspection && (
        <>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
  

  <Button
    icon={<LikeOutlined />}
    style={{
      backgroundColor: "#DCFCE7",
      borderColor: "#86EFAC",
      color: "#166534",
      borderWidth: 1,
      fontWeight: 500,
      textAlign: "right"
    }}
  >
    Customer Agreed
  </Button>
</div>


          <Upload
            beforeUpload={(f) => {
              const realFile = (f as any).originFileObj ?? f;
              setStageFiles(prev => ({
                ...prev,
                [`${stage}-second-invoice`]: realFile as any,
              }));
              return false;
            }}
            maxCount={1}
            showUploadList
          >
            <Button icon={<UploadOutlined />}>
              Upload Second Tax Invoice
            </Button>
          </Upload>
        </>
      )}

      {/* View documents (unchanged rule) */}
      {stage !== ServiceStage.DeliveryOrder &&
        renderDocsForStage(stageExec, stageLabelMap[stage])}
    </Space>
  </div>
)}


            {/* Comment */}
            { stage !== ServiceStage.DropRisk &&
              stage !== ServiceStage.DeliveryOrder && 
              stage !== ServiceStage.Emergency &&
              stage !== ServiceStage.ExitandStoragePayment &&
              stage !== ServiceStage.Transportation &&
              stage !== ServiceStage.Clearance && (
              
  <div style={{ marginBottom: 12 }}>
              <div style={{ marginBottom: 6 }}>
  {stage === ServiceStage.WarehouseStatus
    ? "Settlement Notes"
    :isInspection ? "Summary (from Customs System)"
    : "Comments" }
</div>

              <TextArea rows={2} value={stageComments[stage] || ""} onChange={(e) => setStageComments(prev => ({ ...prev, [stage]: e.target.value }))} />
            </div>
            )}

     {/* 🔵 DROP RISK – Risk Level Selection */}
{stage === ServiceStage.DropRisk && stageExec && (
  <div style={{ marginBottom: 30 }}>
    <div style={{ marginBottom: 24, fontWeight: 600 }}>
      Select Risk Level
    </div>

    <Space wrap>
      {[
        { label: "Blue", value: RiskLevel.Blue, color: "#06b6d4" },
        { label: "Green", value: RiskLevel.Green, color: "#16a34a" },
        { label: "Yellow", value: RiskLevel.Yellow, color: "#ca8a04" },
        { label: "Red", value: RiskLevel.Red, color: "#dc2626" },
      ].map((r) => {
        const isSelected = riskSelections[stage] === r.value;

        return (
          <Button
            key={r.value}
            size="small"
            style={{
              borderRadius: 9999, // pill
              backgroundColor: isSelected ? r.color : "#fff",
              color: isSelected ? "#fff" : r.color,
              borderColor: r.color,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = r.color;
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.color = r.color;
              }
            }}
            
            onClick={async () => {
              try {
                console.log("🟡 Sending risk level to backend:", {
                  stageExecutionId: stageExec.id,
                  riskLevel: r.value,
                });

                // 1️⃣ Save locally (UI)
                setRiskSelections((prev) => ({
                  ...prev,
                  [stage]: r.value,
                }));

                // 2️⃣ Send to backend
                await setRiskLevel(serviceId, r.value);

                console.log("✅ Risk level saved successfully");
                antdMessage.success(`Risk set to ${r.label}`);
              } catch (err) {
                console.error("❌ Failed to save risk level", err);
                antdMessage.error("Failed to save risk level");
              }
            }}
          >
            {r.label}
          </Button>
        );
      })}
    </Space>
  </div>
)}

            {/* Save & Next */}
            <div>
              <Button type="primary" onClick={async () => { await postStageComment(stage); }} loading={saving}>
                Save & Next
              </Button>
            </div>
          </section>
        );
      })}


<Modal
  open={docsModalVisible}
  onCancel={() => setDocsModalVisible(false)}
  footer={null}
  title={`Documents - ${selectedStageTitle}`}
>
  {selectedDocs.map((d) => (
    <div key={d.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: 8, background: "#fbfbfd", borderRadius: 6 }}>
      <div>
        <div style={{ fontWeight: 600 }}>{d.originalFileName ?? d.fileName}</div>
        <div style={{ color: "#6b7280", fontSize: 12 }}>
          {new Date(d.uploadedDate).toLocaleString()} • {d.uploadedByUserId === user?.id ? "CaseExecutor" : "Customer"}
        </div>
      </div>
      <Button
        type="link"
        onClick={() => downloadStageDocument(d.id, d.originalFileName ?? d.fileName)}
      >
        Download
      </Button>
    </div>
  ))}
</Modal>



    </div>
  );
}
