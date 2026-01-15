
"use client";

import UserForm from "../components/UserForm";
import { userRoutes } from "@/modules/user/user.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

const CreateUser = () => {
    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Users',
                            route: userRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Create new user",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <UserForm payload={null} isEdit={false} />
        </div>
    );
}

export default CreateUser;