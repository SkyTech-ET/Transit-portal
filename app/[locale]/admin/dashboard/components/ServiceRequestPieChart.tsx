"use client";

import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#1E3A8A", "#22C55E"];

export default function ServiceRequestPieChart({
  total,
  pending,
}: {
  total: number;
  pending: number;
}) {
  const completed = Math.max(total - pending, 0);
  const t = useTranslations("AdminSidebar");
  const data = [
    { name: "Pending", value: pending },
    { name: "Completed", value: completed },
  ];

  return (
    <div className="rounded-xl border border-[rgb(229,231,235)] bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold">{t("servicerequesttrend")}</h3>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={60} outerRadius={100}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
