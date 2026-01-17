"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyStaffItem {
  serviceName: string;
  progress: number;
}

export default function WeeklyStaffChart({
  data,
}: {
  data: WeeklyStaffItem[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-4 flex items-center justify-center h-[320px]">
        <p className="text-gray-400 text-sm">
          No weekly staff assignment data
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-4 h-[420px]">
      <h3 className="font-semibold mb-3">
        Weekly Staff Assignments
      </h3>

      {/* 👇 HEIGHT IS CRITICAL */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="serviceName"
            tick={{ fontSize: 12 }}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="progress" fill="#12DD5A" radius={[9, 9, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}




