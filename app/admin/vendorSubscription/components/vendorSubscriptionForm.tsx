import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormInstance } from 'antd/lib/form';
import { Button, Form, Select } from "antd";
import { usePermissionStore } from '@/modules/utils';
import { vendorSubscriptionRoutes } from '@/modules/vendorSubscription/vendorSubscription.routes';
import { useVendorSubscriptionStore } from '@/modules/vendorSubscription/vendorSubscription.store';
import { useSubscriptionPackagesStore } from "@/modules/subscriptionPackages/subscriptionPackages.store";
import { RecordStatus } from '@/modules/common/common.types';
import { IVendorSubscriptionDetails } from '@/modules/vendorSubscription';

interface VendorSubscriptionFormProps {
    isEdit: boolean;
    payload: IVendorSubscriptionDetails | null;
}

const VendorSubscriptionForm = (props: VendorSubscriptionFormProps) => {
    const router = useRouter();
    const [form] = Form.useForm();
    const formRef = React.useRef<FormInstance>(null);

    const { currentUser } = usePermissionStore();
    const { loading, updateVendorSubscription, addVendorSubscription } = useVendorSubscriptionStore();
    const { subscriptionPackages, getSubscriptionPackages, loading: loadingPackages } = useSubscriptionPackagesStore();

    const handleSubmit = async () => {
        try {
            const values = await formRef.current?.validateFields();
            const payload = {
                organizationId: currentUser?.organization?.id as number,
                ...values   
            };

            if (props.isEdit) {
                // Update subscription
                const id = props.payload?.id as number;
                await updateVendorSubscription(payload,id ).then(() => {
                    router.push(vendorSubscriptionRoutes.getall);
                });
            } else {
                // Create new subscription
                await addVendorSubscription(payload).then(() => {
                    router.push(vendorSubscriptionRoutes.getall);
                });
            }
        } catch (errorInfo) {
            console.error('Submission failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (subscriptionPackages.length === 0) {
            getSubscriptionPackages(RecordStatus.Active);
        }
    }, []);

    useEffect(() => {
        if (props.payload) {
            console.log(props.payload);
            form.setFieldsValue(props.payload);

            const selectedPackage = subscriptionPackages.find(pkg => pkg.id === props.payload?.subscriptionPackageId);
            if (selectedPackage) {
                form.setFieldsValue({
                    planName: selectedPackage.planName,
                    price: selectedPackage.price,
                    subscriptionPackageId: selectedPackage.id,
                });
            }
        }
    }, [props.payload, form, subscriptionPackages]);
    return (
        <Form
            form={form}
            ref={formRef}
            name="VendorSubscriptionForm"
            autoComplete="off"
            onFinish={handleSubmit}
            labelCol={{ span: 24 }}
        >
            <div className="flex flex-col w-full">
                {/* Subscription Package Select */}
                <Form.Item
                    name="subscriptionPackageId"
                    label={<span className="font-semibold">Subscription Package</span>}
                    rules={[{ required: true, message: "Please select a Subscription Package!" }]}
                    className="md:w-1/3 w-full"
                >
                    <Select
                        loading={loadingPackages}
                        placeholder="Select Subscription Package"
                    >
                        {subscriptionPackages.map((pkg: any) => (
                            <Select.Option key={pkg.id} value={pkg.id}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>{pkg.planName}</span>
                                    <span>{`$${pkg.price}`}</span>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Action Buttons */}
                <div className="flex flex-row space-x-2 w-min">
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ width: "100%", height: "2.4rem" }}
                        >
                            {props.isEdit ? 'Save Changes' : 'Send'}
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            style={{ width: "100%", height: "2.4rem" }}
                            onClick={() => router.push(vendorSubscriptionRoutes.getall)}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </div>
            </div>
        </Form>
    );
};

export default VendorSubscriptionForm;
