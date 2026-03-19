interface Props {
  title: string;
  value: number;
  icon?: React.ReactNode;
  valueStyle?: React.CSSProperties;
}



export default function KpiCard({ title, value }: Props) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
      <p className="text-[#6B7280] text-sm">{title}</p>
      <p className="text-2xl font-semibold text-black mt-2">{value}</p>
    </div>
  );
}
