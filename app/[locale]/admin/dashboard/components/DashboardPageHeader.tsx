"use client";

interface Props {
  defaultValue: any;
  isAdmin: boolean;
}

const DashboardPageHeader = (props: Props) => {
  return (
    <>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:px-6">
        <h1 className="text-lg font-bold">Dashboard</h1>
      </div>
    </>
  );
};
export default DashboardPageHeader;
