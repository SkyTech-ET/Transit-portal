import { useRouter } from 'next/navigation';
import { Button, Dropdown, MenuProps, Modal, Space } from 'antd';
import { ISubscriptionBase } from '@/modules/subscription/subscription.types';
import { ChevronDown, PencilLine } from 'lucide-react';
import { subscriptionRoutes } from '@/modules/subscription/subscription.routes';
import { useState } from 'react';
interface Props {
  canUpdate: boolean;
  canDelete: boolean;
  vendorSubscription: ISubscriptionBase;
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
    props.canDelete
      ? {
          key: 'updateAccount',
          icon: <PencilLine />,
          label: 'Update Account',
          onClick: () => {
            showAccModal();
          },
        }
      : null,
    props.canUpdate
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
      {(props.canUpdate || props.canDelete) && (
        <Dropdown menu={menuProps}>
          <Button type="link">
            <Space>
              More <ChevronDown />
            </Space>
          </Button>
        </Dropdown>
      )}
       
    </>
  );
};

export default SubscriptionTableAction;
