import React from 'react';
import { Alert, Modal, Spin } from 'antd';

interface LoadingDialogProps {
    visible: boolean;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({ visible }) => {
    return (
        <Modal
            title="Please wait..."
            open={visible}
            footer={null}
            closable={false}
            maskClosable={false}
            width={300}
            centered
        >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        </Modal>
    );
};


interface Props {
    title: string
    description: string
    visible: boolean;
}

const AnalyzerLoadingDialog: React.FC<Props> = ({ visible, title, description }) => {
    return (
        <Modal
            title={title}
            open={visible}
            footer={null}
            closable={false}
            maskClosable={false}
            width={300}
            centered
        >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loader">
                    <span></span>
                </div>

            </div>
            <div className='py-2'>
                <Alert message={description} type="info" />
            </div>
        </Modal>
    );
};

export { AnalyzerLoadingDialog }

export default LoadingDialog;
