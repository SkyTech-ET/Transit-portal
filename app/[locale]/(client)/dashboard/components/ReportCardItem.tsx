import { Avatar } from 'antd';
import { ReactNode } from 'react';
interface Props {
    value: any
    title: string
    prefix: ReactNode | null
    bgColor: string | "#4096ff"
}

const ReportCardItem = (props: Props) => {
    const classValue = "float-end mb-3 w-6 h-3";

    return (
        <>
            <div className="bg-white rounded-md p-3 md:w-1/4 cursor-pointer" >
                <div className="flex flex-col text-start justify-start content-start gap-1">
                    <h3 className="text-md text-gray-500">{props.title}</h3>
                    <h1 className="text-lg md:text-2xl font-bold">{props.value}</h1>
                    <div className='flex flex-row justify-end pb-2'>
                        <Avatar style={{ backgroundColor: props.bgColor, verticalAlign: 'middle' }} size="large">
                            <div className={classValue}>{props.prefix}</div>
                        </Avatar>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ReportCardItem