"use client";

import { useRouter } from 'next/navigation';
import { FormInstance } from 'antd/lib/form';
import { IRole } from '@/modules/role/role.types';
import React, { useEffect, useState } from 'react';
import { useRoleStore } from '@/modules/role/role.store';
import { roleRoutes } from '@/modules/role/role.routes';
import { RecordStatus } from '@/modules/common/common.types';
import { IPrivilege } from '@/modules/privilege/privilege.types';
import { Button, Checkbox, Col, Form, Input, Radio, Row } from "antd";
import { usePrivilegeStore } from '@/modules/privilege/privilege.store';


interface RoleFormProps {
    isEdit: boolean
    payload: IRole | null
}

const RoleForm = (props: RoleFormProps) => {
    const formRef = React.useRef<FormInstance>(null);
    const router = useRouter()
    const [form] = Form.useForm();
    
    const { loading, updateRole, addRole } = useRoleStore();
    const { privileges, getPrivileges } = usePrivilegeStore()

    const handleSubmit = async () => {
        try {
            const values = await formRef.current?.validateFields();

            if (props.isEdit) {
                const id = props.payload?.id;
                await updateRole(values, id!).then((res) => {
                    router.push(roleRoutes.getall)
                });
            } else {
                await addRole(values).then((res) => {
                    router.push(roleRoutes.getall)
                });
            }
        } catch (errorInfo) {
            console.error('Failed:', errorInfo);
        }
    };
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const allPrivileges = privileges.map((item: IPrivilege) => item.id);

    const onCheckAllChange = (e: any) => {
        setCheckedList(e.target.checked ? allPrivileges : []);
        form.setFieldsValue({ privileges: e.target.checked ? allPrivileges : [] });
    };
    const onChange = (list: any) => {
        setCheckedList(list);
        form.setFieldsValue({ privileges: list });
    };

    useEffect(() => {
        if (props.payload && Object.keys(props.payload).length > 0) {
            form.setFieldsValue(props.payload!);
            if (Array.isArray(props.payload.privileges)) {
                const selectedPrv = props.payload.privileges.map<number>((prv) => prv.id) as any
                form.setFieldsValue({ privileges: selectedPrv });
                setCheckedList(selectedPrv);
            }
        }
    }, [props.payload!, form]);

    useEffect(() => {
        if (privileges.length == 0) getPrivileges(RecordStatus.Active)
    }, [getPrivileges])

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
                    name="name"
                    label={<span className="font-semibold">Name</span>}
                    rules={[{ required: true, message: "Please input your company name!" }]}
                    labelCol={{ span: 24 }}
                    className='md:w-1/3 w-full'
                >
                    <Input
                        placeholder="Name"
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

                {/* Privileges */}
                <div>
                    <Form.Item
                        name="privileges"
                        label={<span className="font-semibold">Privileges</span>}
                        rules={[{ required: true, message: "Please select privileges!" }]}
                    >
                        <Checkbox
                            onChange={onCheckAllChange}
                            checked={checkedList.length === allPrivileges.length}
                            indeterminate={checkedList.length > 0 && checkedList.length < allPrivileges.length}
                        >
                            {checkedList.length == allPrivileges.length ? 'Uncheck All' : 'Check All'}
                        </Checkbox>
                        <div className='px-4'>
                            <Checkbox.Group value={checkedList} onChange={onChange}>
                                <Row>
                                    {privileges.map((item: any) => (
                                        <Col span={8} key={item.id}>
                                            <Checkbox value={item.id} style={{ lineHeight: '32px' }}>
                                                {item.action}
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </div>
                    </Form.Item>
                </div>

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

                {/* Buttons */}
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
                            onClick={() => { router.push(roleRoutes.getall) }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </div>
            </div>
        </Form >
    </>);

}

export default RoleForm;