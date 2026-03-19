import { useRouter } from 'next/navigation';
import { Button, Dropdown, MenuProps, Modal, Space } from 'antd';
import { IBookingBase } from '@/modules/booking/booking.types';
import { ChevronDown, PencilLine } from 'lucide-react';
import { bookingRoutes } from '@/modules/booking/booking.routes';
import { useState } from 'react';
import BookingOrderStatusForm from './BookingOrderStatusForm';

interface Props {
  canUpdate: boolean;
  booking: IBookingBase;
}

const BookingTableAction = (props: Props) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const items: MenuProps['items'] = [
 
    props.canUpdate
      ? {
          key: 'update',
          icon: <PencilLine />,
          label: 'Update Order',
          onClick: () => {
            showModal();
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
      {(props.canUpdate) && (
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
        title="Update Order Status"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      
      >
        <BookingOrderStatusForm
          isVisible={isModalVisible}
          handleCancel={handleCancel}
          payload={{
            id: props.booking.id,
            orderStatus: props.booking.orderStatus,
          }}
        />
      </Modal>

    
    </>
  );
};

export default BookingTableAction;
