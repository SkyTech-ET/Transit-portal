"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInstance } from 'antd/lib/form';
import { parseImage } from "@/modules/utils";
import { formatFieldName } from '@/modules/utils';
import { PlusOutlined } from '@ant-design/icons';
import { IEvent, IService } from '@/modules/event/event.types';
import { usePermissionStore } from '@/modules/utils';
import {Checkbox, Upload, Button, Form,  Col, Row,Input, Radio } from "antd";
import { eventRoutes } from '@/modules/event/event.routes';
import { useEventStore } from '@/modules/event/event.store';

interface EventFormProps {
    isEdit: boolean
    payload: IEvent | null
   // services: any[]; // Update the type to match your actual service data structure
}

const EventForm = (props: EventFormProps) => {
    const router = useRouter()
    const [form] = Form.useForm();
    const { currentUser } = usePermissionStore()
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [services, setServices] = useState<IService[]>([]);

    const formRef = React.useRef<FormInstance>(null);
    const { loading, updateEvent, addEvent } = useEventStore();
    const orgId = currentUser?.organization?.id;
  

    const onCheckAllChange = (e: any) => {
        const allServices = services.map((service) => service.dataIndex);
        const newCheckedList = e.target.checked ? allServices : [];
        
        setCheckedList(newCheckedList);
        form.setFieldsValue({ services: newCheckedList });
    };

    const onChange = (list: string[]) => {
        setCheckedList(list);
        form.setFieldsValue({ services: list });
    };
    



    const handleSubmit = async () => {
        try {
            const values = await formRef.current?.validateFields();
            let formData = new FormData()

            formData.append('eventName', values.eventName);
            formData.append('description', values.description);
            formData.append('recordStatus', values.recordStatus);


            if (values.imagePath != null && Array.isArray(values.imagePath)) {
                formData.append('imagePath', values.imagePath[0].originFileObj);
            }

            if (props.isEdit) {
                const id = props.payload?.id as any;
                formData.append('id', id);
                if (Array.isArray(values.imagePath)) {
                    formData.append('imagePath', props.payload?.imagePath as any)
                }


                await updateEvent(formData, id).then((res) => {
                    router.push(eventRoutes.getall)
                });
            }
                    else {
                await addEvent(formData).then((res) => {
                    router.push(eventRoutes.getall)
                });
            }
        } catch (errorInfo) {
            console.error('Failed:', errorInfo);
        }
    };
    const onFileChange = (file: any) => {
        if (file && Array.isArray(file.fileList)) {
            form.setFieldValue('imagePath', file.fileList)
        }
    }

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

                {/* Image Uploader */}
                <div className="flex flex-row space-x-4">
                    <Form.Item
                        name="imagePath"
                        label={<span className="font-semibold">Event Image</span>}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                        valuePropName="fileList"
                    >
                        {props.payload?.imagePath &&
                            <div>
                                {/* Using the same parsing function for consistency */}
                                {props.payload?.imagePath && <img
                                    src={parseImage(props.payload.imagePath)}  // Use the same parsing function
                                    alt="Event"
                                    style={{ maxWidth: '200px', marginTop: '10px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/default_image.png';  // Fallback if image fails to load
                                    }}
                                />}

                            </div>
                        }
                        <Upload action="#" listType="picture-card"
                            onChange={onFileChange}>
                            <button style={{ border: 0, background: 'none' }} type="button">
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </button>
                        </Upload>
                    </Form.Item>
                </div>

                
                <div className='flex flex-row justify-start gap-4'>
                    <Form.Item
                        name="eventName"
                        label={<span className="font-semibold">Event Name</span>}
                        rules={[{ required: true, message: "Please input your event name!" }]}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                    >
                        <Input
                            placeholder="Event Name"
                            style={{ padding: "10px", paddingLeft: "10px", marginTop: "1px" }}
                            variant="filled"
                        />
                    </Form.Item>
                </div>

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

                {/* Record status */}
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
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button
                            block
                            style={{ width: "100%", height: "2.4rem" }}
                            onClick={() => { router.push(eventRoutes.getall) }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </div>
            </div>
        </Form >
    </>);

}

export default EventForm;