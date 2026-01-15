interface CardTitleProps {
  title: string;
  subTitle: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ title, subTitle }) => (
  <div className="py-4">
    <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>{title}</h1>
    <span className="text-sm text-gray-600">{subTitle}</span>
  </div>
);
