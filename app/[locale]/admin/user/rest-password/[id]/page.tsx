"use client";

import { useEffect } from "react";
import { userRoutes, useUserStore } from "@/modules/user";

import CustomBreadcrumb from "@/app/[locale]/admin/components/common/CustomBreadcrumb";
import LoadingDialog from "@/app/[locale]/admin/components/common/LoadingDialog";

import ResetPassword from "../components/ResetPassword";

interface Props {
  params: {
    id: number;
  };
}

const ResetUserPassword = ({ params }: Props) => {
  const { listLoading, getUser } = useUserStore();
  useEffect(() => {
    getUser(params.id);
  }, [getUser]);

  return (
    <>
      <div className="flex flex-col gap-4 rounded-md bg-white p-6">
        <div className="flex">
          <CustomBreadcrumb
            items={[
              {
                key: 1,
                title: "Users",
                route: userRoutes.getall,
              },
              {
                key: 2,
                title: "Reset password",
                route: "#",
              },
            ]}
          />
        </div>
        <ResetPassword />
        <LoadingDialog visible={listLoading} />
      </div>
    </>
  );
};

export default ResetUserPassword;
