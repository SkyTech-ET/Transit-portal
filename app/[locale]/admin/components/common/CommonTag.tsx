"use client";

import React from 'react';
import { Button, Radio, Tag } from "antd";
import { PaymentOptions,AccountStatus, OrderStatus, PaymentStatus,RequestStatus, RecordStatus } from "@/modules/common/common.types";

interface RecordStatusProps {
    status: RecordStatus;
    onFilter?: (status: RecordStatus) => void;
}

const recordStatusOptions = [
    { label: 'Active', value: 2 },
    { label: 'Inactive', value: 1 },
    // { label: 'Deleted', value: 3 },
];

const FilterByRecordStatus: React.FC<RecordStatusProps> = ({ status, onFilter: handleFilter }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = parseInt(e.target.value, 10);
        if (handleFilter) handleFilter(selectedValue);
    };

    return (
        <div className='px-6'>
            <Radio.Group
                optionType="button" value={status}
                options={recordStatusOptions}
                onChange={(e: any) => handleChange(e)}
            />
        </div>
    );
};

export const RecordStatusTag = (props: { status: RecordStatus }) => {
    let color = props.status == RecordStatus.Active ? 'green' : 'red';
    let label = props.status == RecordStatus.Active ? 'Active' : 'InActive';

    return (
        <Tag color={color}>
            {label}
        </Tag>
    );
}

export const PaymentStatusTag = (props: { status: PaymentStatus }) => {
    let colorMapping: Record<PaymentStatus, string> = {
        [PaymentStatus.Pending]: 'yellow',
        [PaymentStatus.Paid]: 'green',
        [PaymentStatus.Failed]: 'red',
        [PaymentStatus.Cancelled]: 'gray',
        [PaymentStatus.UnPaid]: 'blue'
    };

    let labelMapping: Record<PaymentStatus, string> = {
        [PaymentStatus.Pending]: 'Pending',
        [PaymentStatus.Paid]: 'Paid',
        [PaymentStatus.Failed]: 'Failed',
        [PaymentStatus.Cancelled]: 'Cancelled',
        [PaymentStatus.UnPaid]: 'UnPaid'
    };

    const color = colorMapping[props.status];
    const label = labelMapping[props.status];

    return (
        <Tag color={color || 'default'}>
            {label} 
        </Tag>
    );
}

export const AccountStatusTag = (props: { status: AccountStatus }) => {
    let colorMapping: Record<AccountStatus, string> = {
        [AccountStatus.Pending]: 'yellow',
        [AccountStatus.Active]: 'green',
        [AccountStatus.InActive]: 'red',
        [AccountStatus.Suspended]: 'gray',
    };

    let labelMapping: Record<AccountStatus, string> = {
        [AccountStatus.Pending]: 'Pending',
        [AccountStatus.Active]: 'Active',
        [AccountStatus.InActive]: 'InActive',
        [AccountStatus.Suspended]: 'Suspended',
    };

    const color = colorMapping[props.status];
    const label = labelMapping[props.status];

    return (
        <Tag color={color || 'default'}>
            {label} 
        </Tag>
    );
}



export const RequestStatusTag = (props: { status: RequestStatus }) => {
    let colorMapping: Record<RequestStatus, string> = {
        [RequestStatus.Pending]: 'yellow',
        [RequestStatus.Approved]: 'green',
        [RequestStatus.Rejected]: 'red',
    };

    let labelMapping: Record<RequestStatus, string> = {
        [RequestStatus.Pending]: 'Pending',
        [RequestStatus.Approved]: 'Approved',
        [RequestStatus.Rejected]: 'Rejected',
    };

    const color = colorMapping[props.status];
    const label = labelMapping[props.status];

    return (
        <Tag color={color || 'default'}>
            {label} 
        </Tag>
    );
}

export const OrderStatusTag = (props: { status: OrderStatus }) => {
    let colorMapping: Record<OrderStatus, string> = {
        [OrderStatus.Pending]: 'yellow',
        [OrderStatus.Approved]: 'green',
        [OrderStatus.InProgress]: 'gray',
        [OrderStatus.Completed]: 'blue',
        [OrderStatus.Cancelled]: 'red',
    };

    let labelMapping: Record<OrderStatus, string> = {
        [OrderStatus.Pending]: 'Pending',
        [OrderStatus.Approved]: 'Approved',
        [OrderStatus.InProgress]: 'InProgress',
        [OrderStatus.Completed]: 'Completed',
        [OrderStatus.Cancelled]: 'InProgress',
    };

    const color = colorMapping[props.status];
    const label = labelMapping[props.status];

    return (
        <Tag color={color || 'default'}>
            {label} 
        </Tag>
    );
}

export const PaymentOptionTag = (props: { status: PaymentOptions }) => {
    let color = props.status == 1 ? 'blue' : '';
    let label = props.status == 1 ? 'Online' : 'Cash';

    return (
        <Tag color={color}>
            {label} 
        </Tag>
    );
}

export const BooleanParserTag = (props: { value: boolean }) => {
    let color = props.value ? 'blue' : 'yellow';
    let label = props.value ? 'Allowed' : 'Not Allowed';

    return (
        <Tag color={color}>
            {label}
        </Tag>
    );
}

export const AmountParserTag = (props: { amount: any }) => {
    let amount = parseFloat(props.amount);

    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });


    return (
        <Tag color='blue-inverse'>
            {formatter.format(amount)}
        </Tag>
    );
}

export const CurrencyParserTag = (props: { currency: any }) => {
    let amount = parseFloat(props.currency);

    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB', // Use the Ethiopian Birr (ETB) currency code
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code', // Change 'code' to 'symbol' if the currency has a symbol
    });

    // If you want to append "ብር" instead of the default formatting
    const formattedAmount = formatter.format(amount).replace('ETB', 'ETB');

    return (
        <Tag color="gold">
            {formattedAmount}
        </Tag>
    );
};

export const NumberParserTag = (props: { value: any, color: string }) => {
    return (
        <Tag color={props.color}>
            {props.value?.toLocaleString('en-US')}
        </Tag>
    );
}

export const NameParserTag = (props: { value: string }) => {

    return (
        <Tag color='blue'>
            {props.value}
        </Tag>
    );
}

export const EmailParserTag = (props: { email: string, subject: string, body: string }) => {
    const handleClick = () => {
        const mailto = `mailto:${props.email}?subject=${encodeURIComponent(props.subject)}&body=${encodeURIComponent(props.body)}`;
        window.open(mailto, '_blank');
    };

    return (
        <Button type="link" onClick={handleClick}>
            {props.email}
        </Button>
    );
};

export default FilterByRecordStatus;
