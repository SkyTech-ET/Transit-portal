"use client";

import { useEffect } from "react";
import { useUserStore } from "@/modules/user";
import UpdatePassword from "../components/UpdatePassword"
import ProfileInformation from "../components/ProfileInformation"
import LoadingDialog from "@/app/admin/components/common/LoadingDialog";
import VendorInformation from "../components/VendorInformation";
import { Tabs, TabsProps } from "antd";
import VendorForm from "@/app/admin/vendor/components/VendorForm";
import layout from "@/app/admin/dashboard/layout";


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
          children: (
            <ProfileInformation payload={user!} />
          ),
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
          children: (
            <UpdatePassword />
          ),
        },
      ];
     const onChange = (key: string) => {
     
      };
    useEffect(() => { 
      getUser(params.id) 
    
    }, [getUser])

    return (<>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            
            <div className="py-4"></div>
            <LoadingDialog visible={listLoading} />
        </div>
    </>)
}




export default UserProfile;