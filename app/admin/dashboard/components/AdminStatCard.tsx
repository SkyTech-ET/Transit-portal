interface Props {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

export default function AdminStatCard({ title, value, icon }: Props) {
  return (
    <div
      className="flex items-center justify-between bg-white
                 border border-[#E5E7EB] rounded-xl px-6 py-4
                 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
    >
      <div>
        <p className="text-[#9CA3AF] text-sm">{title}</p>
        <p className="text-[#1F2937] text-xl font-semibold mt-1">
          {value}
        </p>
      </div>

      <div className="w-10 h-10 rounded-full bg-[#F3F4F6]
                      flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}
