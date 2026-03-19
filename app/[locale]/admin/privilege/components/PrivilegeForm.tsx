"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormInstance } from 'antd/lib/form';
import { Button, Form, Input, Radio } from "antd";
import { IPrivilege } from '@/modules/privilege/privilege.types';
import { privilegeRoutes } from '@/modules/privilege/privilege.routes';
import { usePrivilegeStore } from '@/modules/privilege/privilege.store';


interface PrivilegeFormProps {
    isEdit: boolean
    payload: IPrivilege | null
}


const PrivilegeForm = (props: PrivilegeFormProps) => {
    const formRef = React.useRef<FormInstance>(null);
    const router = useRouter()
    const [form] = Form.useForm();

    const { loading, updatePrivilege, addPrivilege } = usePrivilegeStore();

    const handleSubmit = async () => {
        try {
            const values = await formRef.current?.validateFields();
            if (props.isEdit) {
                const id = props.payload?.id;
                await updatePrivilege(values, id!).then((res) => {
                    router.push(privilegeRoutes.getall)
                });
            } else {
                await addPrivilege(values).then((res) => {
                    router.push(privilegeRoutes.getall)
                })
            }
        } catch (errorInfo) {
            console.error('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (props.payload && Object.keys(props.payload).length > 0) {
            form.setFieldsValue(props.payload!);
        }
    }, [props.payload!, form]);


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
                <Form.Item
                    name="action"
                    label={<span className="font-semibold">Action</span>}
                    rules={[{ required: true, message: "Please input your company name!" }]}
                    labelCol={{ span: 24 }}
                    className='md:w-1/3 w-full'
                >
                    <Input
                        placeholder="Action"
                        style={{ padding: "10px", paddingLeft: "10px", marginTop: "1px" }}
                        variant="filled"
                    />
                </Form.Item>

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

                <div>
                    <Form.Item name="recordStatus" label="Status"
                        rules={[{ required: true, message: "Please select record status!" }]}
                    >
                        <Radio.Group optionType="button" >
                            <Radio value={2}>Active</Radio>
                            <Radio value={1}>InActive</Radio>
                        
                        </Radio.Group>
                    </Form.Item>
                </div>

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
                            onClick={() => { router.push(privilegeRoutes.getall) }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </div>
            </div>
        </Form >
    </>);

}

export default PrivilegeForm;