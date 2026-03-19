"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#1E3A8A", "#22C55E"];

export default function ServiceRequestPieChart({
  total,
  pending,
}: {
  total: number;
  pending: number;
}) {
  const completed = Math.max(total - pending, 0);

  const data = [
    { name: "Pending", value: pending },
    { name: "Completed", value: completed },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Service Request Trend</h3>

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
