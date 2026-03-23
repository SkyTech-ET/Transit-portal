"use client";

import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  const t = useTranslations("AdminSidebar");
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-xl border bg-white p-4">
        <p className="text-sm text-gray-400">
          {t("noweeklystaffassignmentdata")}
        </p>
      </div>
    );
  }

  return (
    <div className="h-[420px] rounded-xl border bg-white p-4">
      <h3 className="mb-3 font-semibold">{t("weeklystaffasseignments")}</h3>

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
