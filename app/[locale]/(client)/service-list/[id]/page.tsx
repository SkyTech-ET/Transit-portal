"use client";

import { useParams } from "next/navigation";

export default function StageExecutionPage() {
  const params = useParams(); // { id: string }
  const serviceId = params.id;

  return (
    <div className="p-10">
      <h1>Stage Execution for Service {serviceId}</h1>
      {/* Load service details here */}
    </div>
  );
}
