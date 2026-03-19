"use client";

import { useEffect } from "react";
import { useUserStore } from "@/modules/user";
import { Tabs, TabsProps } from "antd";

import LoadingDialog from "@/app/[locale]/admin/components/common/LoadingDialog";
import layout from "@/app/[locale]/admin/dashboard/layout";
import VendorForm from "@/app/[locale]/admin/vendor/components/VendorForm";

import ProfileInformation from "../components/ProfileInformation";
import UpdatePassword from "../components/UpdatePassword";
import VendorInformation from "../components/VendorInformation";

interface Props {
  params: {
    id: number;
  };
}

const UserProfile = ({ params }: Props) => {
  const { listLoading, user, getUser } = useUserStore();
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Update Profile",
      children: <ProfileInformation payload={user!} />,
    },
    /* {
          key: "2",
          label: "Update Vendor",
          children: (
            <VendorForm payload={user?.organization} isEdit={true} />
          ),
        }, */
    {
      key: "3",
      label: "Update Password",
      children: <UpdatePassword />,
    },
  ];
  const onChange = (key: string) => {};
  useEffect(() => {
    getUser(params.id);
  }, [getUser]);

  return (
    <>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

        <div className="py-4"></div>
        <LoadingDialog visible={listLoading} />
      </div>
    </>
  );
};

export default UserProfile;
