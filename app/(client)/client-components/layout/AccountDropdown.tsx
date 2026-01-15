"use client";

import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import { authRoutes } from '@/modules/auth';
import { useRouter } from 'next/navigation';
import { UserOutlined } from '@ant-design/icons';
import { userRoutes, IUser } from '@/modules/user';
import useAuthStore from '@/modules/auth/auth.store';
import { Avatar, Button, Popover, Space } from 'antd';
import LoadingDialog from '../common/LoadingDialog';

const AccountDropdown = (props: { currentUser: IUser | null }) => {

    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { loading, logout } = useAuthStore()

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const onLogout = async () => {
        await logout();
        router.push(authRoutes.login);
        window.location.reload()
    }

    const content = (
        <div className="flex flex-col">
            <div className="flex flex-col justify-center items-center gap-1">
                <Avatar
                    className='cursor-pointer'
                    size={{ xs: 14, sm: 18, md: 24, lg: 30, xl: 34, xxl: 50 }}
                    icon={<UserOutlined />}
                />
                <p className='text-md font-semibold'>{props.currentUser?.firstName} {props.currentUser?.lastName}</p>
                <a href="#" className="text-sm text-blue-400 ">{props.currentUser?.email}</a>
            </div>
            <div className="w-full my-3 border-t border-slate-100" />
            <div className="flex flex-row justify-between">
                <Button onClick={() => router.push(userRoutes.profile + props.currentUser?.id)} type='text'>
                    <Space>
                        <UserRound />
                        Edit Profile
                    </Space>
                </Button>
            </div>
            <div className="w-full my-3 border-t border-slate-100" />
            <div className="flex flex-row justify-between">
                <div className='mt-1 text-gray-400'>My Account</div>
                <Button onClick={() => onLogout()} type='link' danger>
                    Logout
                </Button>
            </div>
        </div >
    );

    return (
        <>
            <Popover
                open={open}
                trigger="click"
                content={content}
                onOpenChange={handleOpenChange}
            >
                <Avatar
                    className='cursor-pointer'
                    size={{ xs: 28, sm: 28, md: 28, lg: 30, xl: 34, xxl: 50 }}
                    icon={<UserOutlined />}
                />
            </Popover>
            <LoadingDialog visible={loading} />
        </>
    );
};

export default AccountDropdown;