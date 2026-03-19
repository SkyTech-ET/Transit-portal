"use client";

import { useEffect } from "react";
import { userRoutes } from "@/modules/user/user.routes";
import { useUserStore } from "@/modules/user/user.store";

import CustomBreadcrumb from "@/app/[locale]/admin/components/common/CustomBreadcrumb";
import LoadingDialog from "@/app/[locale]/admin/components/common/LoadingDialog";

import UserForm from "../../components/UserForm";

interface Props {
  params: {
    id: number;
  };
}

const EditUser = ({ params }: Props) => {
  const { listLoading, user, getUser } = useUserStore();
  useEffect(() => {
    getUser(params.id);
  }, [getUser]);

  return (
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
              title: "Edit user info",
              route: "#",
            },
          ]}
        />
      </div>
      <LoadingDialog visible={listLoading} />
      <UserForm payload={user} isEdit={true} />
    </div>
  );
};

export default EditUser;
