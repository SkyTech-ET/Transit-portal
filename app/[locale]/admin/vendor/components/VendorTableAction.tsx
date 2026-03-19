import { useState } from "react";
import { useRouter } from "next/navigation";
import { vendorRoutes } from "@/modules/vendor/vendor.routes";
import { IVendor } from "@/modules/vendor/vendor.types";
import { Button, Dropdown, MenuProps, Modal, Space } from "antd";
import {
  ChevronDown,
  Eye,
  FileStack,
  Package,
  PencilLine,
  Users,
} from "lucide-react";

import SubscriptionAccStatusForm from "../../subscription/components/SubscriptionAccStatusForm";

interface Props {
  canView: boolean;
  canViewOrgUsers: boolean;
  canUpdateAcc: boolean;
  vendor: IVendor;
}

const VendorTableAction = (props: Props) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const items: MenuProps["items"] = [
    props.canView
      ? {
          key: "2",
          icon: <Eye />,
          label: "View",
          onClick: () => {
            router.push(vendorRoutes.view + props.vendor.id);
          },
        }
      : null,
    props.canViewOrgUsers
      ? {
          key: "3",
          label: "View users",
          icon: <Users />,
          onClick: () => {
            router.push(vendorRoutes.users + props.vendor.id);
          },
        }
      : null,
    props.canUpdateAcc
      ? {
          key: "4",
          icon: <PencilLine />,
          label: "Update Account",
          onClick: () => {
            showModal();
          },
        }
      : null,
  ];
  const handleMenuClick: MenuProps["onClick"] = (e) => {};
console.log(props.vendor.subscriptionPackages);
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <>
      {props.canView || props.canUpdateAcc ? (
        <Dropdown menu={menuProps}>
          <Button type="link">
            <Space>
              More <ChevronDown />
            </Space>
          </Button>
        </Dropdown>
      ) : null}
      <Modal
        title="Update Account Status"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <SubscriptionAccStatusForm
          isVisible={isModalVisible}
          handleCancel={handleCancel}
          payload={{
            id: props.vendor.id,
            accountStatus: props.vendor.accountStatus,
          }}
        />
      </Modal>
    </>
  );
};

export default VendorTableAction;
