import { useRouter } from 'next/navigation';
import { Button, Dropdown, MenuProps, Modal, Space } from 'antd';
import { ISubscriptionBase } from '@/modules/subscription/subscription.types';
import { ChevronDown, PencilLine } from 'lucide-react';
import { subscriptionRoutes } from '@/modules/subscription/subscription.routes';
import { useState } from 'react';
import SubscriptionAccStatusForm from './SubscriptionAccStatusForm';
import SubscriptionReqStatusForm from './SubscriptionReqStatusForm';

interface Props {
  canUpdateAcc: boolean;
  canUpdateReq: boolean;
  subscription: ISubscriptionBase;
}

const SubscriptionTableAction = (props: Props) => {
  const router = useRouter();
  const [isAccModalVisible, setIsAccModalVisible] = useState(false);
  const [isReqModalVisible, setIsReqModalVisible] = useState(false);

  const showAccModal = () => {
    setIsAccModalVisible(true);
  };
  const showReqModal = () => {
    setIsReqModalVisible(true);
  };

  const handleCancel = () => {
    setIsAccModalVisible(false);
    setIsReqModalVisible(false);
  };
  const items: MenuProps['items'] = [
    props.canUpdateAcc
      ? {
          key: 'updateAccount',
          icon: <PencilLine />,
          label: 'Update Account',
          onClick: () => {
            showAccModal();
          },
        }
      : null,
    props.canUpdateReq
      ? {
          key: 'updateRequest',
          icon: <PencilLine />,
          label: 'Update Subscription',
          onClick: () => {
            showReqModal();

          },
        }
      : null,
  ].filter(Boolean);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('Menu clicked:', e);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      {(props.canUpdateReq || props.canUpdateAcc) && (
        <Dropdown menu={menuProps}>
          <Button type="link">
            <Space>
              More <ChevronDown />
            </Space>
          </Button>
        </Dropdown>
      )}

      {/* Account Update Modal */}
      <Modal
        title="Update Account Status"
        open={isAccModalVisible}
        onCancel={handleCancel}
        footer={null}
      
      >
        <SubscriptionAccStatusForm
          isVisible={isAccModalVisible}
          handleCancel={handleCancel}
          payload={{
            id: props.subscription.id,
            accountStatus: props.subscription.accountStatus,
          }}
        />
      </Modal>

      {/* Request Update Modal (if needed in the future) */}
      {isReqModalVisible && (
        <Modal
        title="Update Request Status"
        open={isReqModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <SubscriptionReqStatusForm
          isVisible={isReqModalVisible}
          handleCancel={handleCancel}
          payload={{
            id: props.subscription.id,
            requestStatus: props.subscription.requestStatus,
          }}
        />
      </Modal>
      )}
    </>
  );
};

export default SubscriptionTableAction;
