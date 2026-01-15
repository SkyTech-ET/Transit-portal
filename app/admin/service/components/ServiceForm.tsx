"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormInstance } from 'antd/lib/form';
import { parseImage } from "@/modules/utils";
import { PlusOutlined } from '@ant-design/icons';
import { IService } from '@/modules/service/service.types';
import { usePermissionStore } from '@/modules/utils';
import { Upload, Button, Form, Input, Radio } from "antd";
import { serviceRoutes } from '@/modules/service/service.routes';
import { useServiceStore } from '@/modules/service/service.store';

interface ServiceFormProps {
    isEdit: boolean
    payload: IService | null
}

const ServiceForm = (props: ServiceFormProps) => {
    const router = useRouter()
    const [form] = Form.useForm();
    const { currentUser } = usePermissionStore()
    const formRef = React.useRef<FormInstance>(null);
    const { loading, updateService, addService } = useServiceStore();
    const handleSubmit = async () => {
        try {
            const values = await formRef.current?.validateFields();
            
            
            if (props.isEdit) {
                const id = props.payload?.id as any;
                await updateService(values, id).then((res) => {
                    router.push(serviceRoutes.getall)
                });
            } 
            
            else {
                // Create operation: include organizationId
                const enhancedValues = {
                    ...values,
                    organizationId: currentUser?.organization?.id as any // Add organizationId only for create
                };
                await addService(enhancedValues); // Use enhanced values
            // Redirect after successful operation
            router.push(serviceRoutes.getall);
            }
    

        } catch (errorInfo) {
            console.error('Failed:', errorInfo);
        }
    };


    useEffect(() => {
        if (props.payload && Object.keys(props.payload).length > 0) {
            form.setFieldsValue(props.payload!);
        }
    }, [props.payload!, form, currentUser]);

    return (<>
        <Form
            form={form}
            ref={formRef}
            name="Add/Edit"
            autoComplete="off"
            onFinish={handleSubmit}
            labelCol={{ span: 24 }}
            requiredMark={true}
        >
            <div className="flex flex-col w-full ">

                {/*  Name and Location */}
                <div className='flex flex-row justify-start gap-4'>
                    <Form.Item
                        name="serviceName"
                        label={<span className="font-semibold">Menu's Name</span>}
                        rules={[{ required: true, message: "Please input your menu's name!" }]}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                    >
                        <Input
                            placeholder="service Name"
                            style={{ padding: "10px", paddingLeft: "10px", marginTop: "1px" }}
                            variant="filled"
                        />
                    </Form.Item>

                </div>
     
                <div className='flex flex-row justify-start gap-4'>

               {/* Description */}
                <Form.Item
                    name="description"
                    label={<span className="font-semibold">Description</span>}
                    rules={[{ required: true, message: "Please input your description!" }]}
                    labelCol={{ span: 24 }}
                    className='md:w-1/3 w-full'
                >
                    <Input.TextArea
                        placeholder="Description"
                        style={{ padding: "10px", paddingLeft: "10px", marginTop: "1px" }}
                        variant="filled"
                    />
                </Form.Item>
                </div>
                {/* Record status */}
                <div>
          
                <Form.Item
                    name="recordStatus"
                    label="Status"
                    rules={[{ required: true, message: "Please select record status!" }]}
                >
                    <Radio.Group optionType="button">
                    <Radio value={2}>Active</Radio>
                    <Radio value={1}>InActive</Radio>
                    </Radio.Group>
                </Form.Item>
           

                </div>

                {/* Action Buttons */}
                <div className='flex flex-row space-x-2 w-min'>
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            style={{ width: "100%", height: "2.4rem" }}
                        >
                            {props.payload != null ? 'Save change' : 'Create'}
                        </Button>
                    </Form.Item>
                    {/* <Form.Item wrapperCol={{ span: 24 }}>
                        <Button
                            htmlType="submit"
                            block
                            style={{ width: "100%", height: "2.4rem" }}
                        >
                            Create and create another
                        </Button>
                    </Form.Item> */}
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button
                            block
                            style={{ width: "100%", height: "2.4rem" }}
                            onClick={() => { router.push(serviceRoutes.getall) }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </div>
            </div>
        </Form >
    </>);

}

export default ServiceForm;