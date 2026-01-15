"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormInstance } from 'antd/lib/form';
import { IUser } from '@/modules/user/user.types';
import { userRoutes } from '@/modules/user/user.routes';
import { useUserStore } from '@/modules/user/user.store';
import { useRoleStore } from '@/modules/role/role.store';
import { Button, Form, Input, Radio, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RecordStatus } from '@/modules/common/common.types';
import { usePermissionStore } from '@/modules/utils/permission/permission.store';


interface UserFormProps {
    isEdit: boolean
    payload: IUser | null
}


const UserForm = (props: UserFormProps) => {
    const formRef = React.useRef<FormInstance>(null);
    const router = useRouter()
    const [form] = Form.useForm();

    const { roles, getRoles } = useRoleStore();
    const { currentUser, isAdmin } = usePermissionStore()
    const { loading, updateUser, addUser, setAdditionalParams } = useUserStore();

    const handleSubmit = async (values: any) => {
        try {
            // Values are passed from onFinish, but we can also validate if needed
            await formRef.current?.validateFields();
           
            // Additional check for role selection
            if (!values.roles) {
                return;
            }
            
            // Transform form data to match backend expected format (PascalCase)
            const formData: any = {
                FirstName: values.firstName,
                LastName: values.lastName,
                UserName: values.username, // Backend expects "UserName" not "Username"
                Email: values.email,
                Phone: values.phoneNumber,
                IsSuperAdmin: values.isSuperAdmin || false,
                RecordStatus: 2, // Active status
                Roles: values.roles ? [values.roles] : [], // Convert single role to array format expected by backend
                ProfileFile: values.profileFile || null,
                OrganizationId: currentUser?.organization?.id || null
            };
            
            // Only include password for create, not for update
            if (!props.isEdit && values.password) {
                formData.Password = values.password;
            }
            
            // Handle organization ID safely - only set if organization exists
            if (isAdmin && currentUser?.organization?.id) {
                setAdditionalParams({
                    orgId: currentUser.organization.id,
                    userId: null,
                    roles: []
                });
            } else if (isAdmin) {
                // If admin but no organization, set to null
                setAdditionalParams({ 
                    orgId: null, 
                    userId: null,
                    roles: []
                });
            }
            
            if (props.isEdit) {
                const id = props.payload?.id as any;
                await updateUser(formData, id).then((res) => {
                    routeTo()
                });
            } else {
               
                await addUser(formData).then((res) => {
                  routeTo()
                }).catch((error) => {
               });
            }
        } catch (errorInfo) {
            console.error('Failed:', errorInfo);
        }
    };
    const routeTo = () => {
        if (!isAdmin) {
            router.push(userRoutes.byOrg)
            setAdditionalParams({ orgId: null, roles: [], userId: null })
        } else {
            router.push(userRoutes.getall)
        }
    }
    useEffect(() => {
        if (roles.length === 0 && isAdmin) {
            getRoles(RecordStatus.Active);
        }
    }, [isAdmin])

    useEffect(() => {
        if (props.payload && Object.keys(props.payload).length > 0) {
           
            // Map backend field names to form field names
            const formValues = {
                firstName: props.payload.firstName,
                lastName: props.payload.lastName,
                username: props.payload.username,
                email: props.payload.email,
                phoneNumber: props.payload.phoneNumber, // Use phoneNumber property
                profileFile: props.payload.profilePhoto, // Backend returns 'profilePhoto', form expects 'profileFile'
                isSuperAdmin: props.payload.isSuperAdmin,
                recordStatus: props.payload.recordStatus,
                roles: Array.isArray(props.payload.userRoles) && props.payload.userRoles.length > 0 ? props.payload.userRoles[0].roleId  : null,// Map first userRole to single role ID

            };
            
            // For editing, set the existing profile photo as a file list for the Upload component
            if (props.isEdit && props.payload.profilePhoto) {
                formValues.profileFile = [{
                    uid: '-1',
                    name: 'existing-photo.jpg',
                    status: 'done',
                    url: `https://transitportal.skytechet.com/${props.payload.profilePhoto}`, // Construct full URL
                }];
            }
            
         form.setFieldsValue(formValues);
            
            // Verify the form values were set correctly
            setTimeout(() => {
                const currentFormValues = form.getFieldsValue();
            }, 100);
        }
    }, [props.payload!, form]);


    return (<>
        <Form
            form={form}
            ref={formRef}
            name="Add/Edit"
            autoComplete="off"
            onFinish={(values) => {
               handleSubmit(values);
            }}
            onFinishFailed={(errorInfo) => {
           }}
            labelCol={{ span: 24 }}
            requiredMark={true}
        >
            <div className="flex flex-col  w-full ">
                {/* Name */}
                <div className="flex flex-row space-x-4">
                    <Form.Item
                        name="firstName"
                        label={<span className="font-semibold text-gray-700">First Name</span>}
                        rules={[{ required: true, message: "The FirstName field is required." }]}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                    >
                        <Input
                            placeholder="Enter first name"
                            size="large"
                            variant="outlined"
                            className="w-full"
                            style={{
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label={<span className="font-semibold text-gray-700">Last Name</span>}
                        rules={[{ required: true, message: "The LastName field is required." }]}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                    >
                        <Input
                            placeholder="Enter last name"
                            size="large"
                            variant="outlined"
                            className="w-full"
                            style={{
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </Form.Item>
                </div>

                {/* Username and Email */}
                <div className="flex flex-row space-x-4">
                    <Form.Item
                        name="username"
                        label={<span className="font-semibold text-gray-700">Username</span>}
                        rules={[{ required: true, message: "The Username field is required." }]}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                    >
                        <Input
                            placeholder="Enter username"
                            size="large"
                            variant="outlined"
                            className="w-full"
                            style={{
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={<span className="font-semibold text-gray-700">Email</span>}
                        rules={[
                            { required: true, message: "The Email field is required." },
                            { type: 'email', message: 'Please enter a valid email address!' }
                        ]}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                    >
                        <Input
                            placeholder="Enter email address"
                            size="large"
                            variant="outlined"
                            className="w-full"
                            style={{
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </Form.Item>
                </div>

                {/* Password */}
                {!props.isEdit ?
                    <div className="flex flex-row space-x-4">
                        <Form.Item
                            name="password"
                            label={<span className="font-semibold text-gray-700">Password</span>}
                            rules={[
                                { required: true, message: "The Password field is required." },
                                { min: 8, message: 'Password must be at least 8 characters!' },
                            ]}
                            labelCol={{ span: 24 }}
                            className="md:md:w-1/3 w-full"
                        >
                            <Input.Password
                                placeholder="Enter password"
                                size="large"
                                variant="outlined"
                                className="w-full"
                                style={{
                                    borderRadius: '8px',
                                    border: '2px solid #e5e7eb',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmpassword"
                            label={<span className="font-semibold text-gray-700">Confirm Password</span>}
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your password!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("The  password do not match!")
                                        );
                                    },
                                }),
                            ]}
                            labelCol={{ span: 24 }}
                            className="md:md:w-1/3 w-full"
                        >
                            <Input.Password
                                placeholder="Confirm password"
                                size="large"
                                variant="outlined"
                                className="w-full"
                                style={{
                                    borderRadius: '8px',
                                    border: '2px solid #e5e7eb',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </Form.Item>
                    </div> : null
                }
                    <div className='flex flex-row space-x-4'>
                {/* Role and Organization */}
                {
                    isAdmin &&
                        <Form.Item name="roles"
                            label={<span className="font-semibold text-gray-700">Role</span>}
                            rules={[
                                { required: true, message: "Please select a role!" },
                                { 
                                    validator: (_, value) => {
                                        if (!value) {
                                            return Promise.reject(new Error('Please select a role!'));
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                            labelCol={{ span: 24 }}
                            className='md:w-1/3 w-full'>
                            <Select 
                                placeholder="Choose a role..."
                                size="large"
                                variant="outlined"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                className="w-full"
                                style={{
                                    borderRadius: '8px',
                                    border: '2px solid #e5e7eb',
                                    transition: 'all 0.3s ease'
                                }}
                                dropdownStyle={{
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #e5e7eb'
                                }}
                                suffixIcon={
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                }
                            >
                                {roles.map((role: any) => {
                                    return (
                                        <Select.Option 
                                            key={role.id} 
                                            value={role.id}
                                            className="py-2 px-3 hover:bg-blue-50 transition-colors"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="font-medium text-gray-700">{role.name}</span>
                                            </div>
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    }
                        <Form.Item
                        name="phoneNumber"
                        label={<span className="font-semibold text-gray-700">Phone Number</span>}
                        rules={[{ required: true, message: "The Phone field is required." }]}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                    >
                        <Input
                            placeholder="Enter phone number"
                            size="large"
                            variant="outlined"
                            className="w-full"
                            style={{
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </Form.Item>
                    </div>

                {/* Profile Photo Upload */}
                <div className="flex flex-row space-x-4">
                    <Form.Item
                        name="profileFile"
                        label={<span className="font-semibold">Profile Photo</span>}
                        rules={[{ required: !props.isEdit, message: "The ProfileFile field is required." }]}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                    >
                        <Upload
                            beforeUpload={(file) => {
                                // Validate image format
                                const isImage = file.type.startsWith('image/');
                                if (!isImage) {
                                    message.error('You can only upload image files!');
                                    return false;
                                }
                                
                                // Validate file size (max 5MB)
                                const isLt5M = file.size / 1024 / 1024 < 5;
                                if (!isLt5M) {
                                    message.error('Image must be smaller than 5MB!');
                                    return false;
                                }
                                
                                // Validate specific image formats
                                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                                if (!allowedTypes.includes(file.type)) {
                                    message.error('Only JPG, PNG, GIF, and WebP images are allowed!');
                                    return false;
                                }
                                
                                // Set the file in the form
                                form.setFieldValue('profileFile', file);
                                return false; // Prevent auto upload
                            }}
                            onChange={(info) => {
                                if (info.fileList.length > 0) {
                                    // If it's a new file (has originFileObj), use that
                                    if (info.fileList[0].originFileObj) {
                                        form.setFieldValue('profileFile', info.fileList[0].originFileObj);
                                    } else {
                                        // If it's an existing file (no originFileObj), keep the existing value
                                        form.setFieldValue('profileFile', props.payload?.profilePhoto);
                                    }
                                } else {
                                    form.setFieldValue('profileFile', null);
                                }
                            }}
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            maxCount={1}
                            listType="picture-card"
                            fileList={props.isEdit && props.payload?.profilePhoto ? [{
                                uid: '-1',
                                name: 'existing-photo.jpg',
                                status: 'done',
                                url: `https://transitportal.skytechet.com/${props.payload.profilePhoto}`,
                            }] : []}
                        >
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Upload Photo</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </div>

                {/* SuperAdmin and Record Status */}
                <div className="flex flex-row space-x-4">
                    <Form.Item 
                        name="isSuperAdmin" 
                        label={<span className="font-semibold">Super Admin</span>}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                        initialValue={false}
                    >
                        <Radio.Group optionType="button">
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item 
                        name="recordStatus" 
                        label={<span className="font-semibold">Status</span>}
                        rules={[{ required: true, message: "Please select record status!" }]}
                        labelCol={{ span: 24 }}
                        className='md:w-1/3 w-full'
                    >
                        <Radio.Group optionType="button">
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
                            onClick={() => {
                           }}
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
                            onClick={() => { router.push(userRoutes.getall) }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </div>

            </div>
        </Form >
    </>);

}

export default UserForm;