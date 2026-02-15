import { Card } from "antd";

interface Props {
  title: string;
  value: number | string;
  suffix?: string;
}

export default function StatCard({ title, value, suffix }: Props) {
  return (
    <Card className="rounded-lg shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-semibold mt-1">
        {value}
        {suffix && <span className="text-sm ml-1">{suffix}</span>}
      </p>
    </Card>
  );
}
