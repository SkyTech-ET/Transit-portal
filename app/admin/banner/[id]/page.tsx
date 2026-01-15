
"use client";

import { useEffect } from "react";
import BannerForm from "../components/BannerForm";
import { bannerRoutes } from "@/modules/banner/banner.routes";
import { useBannerStore } from "@/modules/banner/banner.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

interface Props {
    params: {
        id: number;
    };
}

const EditBanner = ({ params }: Props) => {
    const { listLoading, banner, getBanner } = useBannerStore();
    useEffect(() => { getBanner(params.id) }, [getBanner])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Banner',
                            route: bannerRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit banner info",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <BannerForm payload={banner} isEdit={true} />
            <LoadingDialog visible={listLoading} />
        </div>
    );
}

export default EditBanner;