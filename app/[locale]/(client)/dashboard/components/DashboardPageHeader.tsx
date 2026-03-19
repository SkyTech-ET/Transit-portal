"use client";

interface Props {
    defaultValue: any
    isAdmin: boolean
}

const DashboardPageHeader = (props: Props) => {

    return (
        <div className="flex md:flex-row flex-col justify-between md:px-6 gap-3">
            <h1 className="text-lg font-bold">Dashboard</h1>
        </div>
    )
}
export default DashboardPageHeader;