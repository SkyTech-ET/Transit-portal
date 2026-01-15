import { RecordStatusTag } from "../../components/common/CommonTag";
import { IVendor } from "@/modules/vendor/vendor.types";

const VendorDetail = (props: { vendor: IVendor | null| undefined }) => {
    return (
        <div className="card bg-white rounded-md w-full">
            <div className="w-full justify-start content-start grid grid-cols-3  py-3 gap-4">
                <div className="flex flex-col gap-2">
                    <span className="text-gray-400 text-sm">Name</span>
                    <span className="text-brand-950 font-bold">{props.vendor?.name}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-gray-400 text-sm">Address</span>
                    <span className="text-brand-950 font-bold">{props.vendor?.address}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-gray-400 text-sm">City</span>
                    <span className="text-brand-950 font-bold">{props.vendor?.city}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-gray-400 text-sm">State</span>
                    <span className="text-brand-950 font-bold">{props.vendor?.state}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-gray-400 text-sm">Description</span>
                    <span className="text-brand-950 font-bold">{props.vendor?.description}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-gray-400 text-sm">Record Status</span>
                    <span className="text-brand-950 font-bold">
                        {props.vendor?.recordStatus && <RecordStatusTag status={props.vendor?.recordStatus} />}</span>
                </div>
            </div>
        </div>
    );
}


export default VendorDetail;