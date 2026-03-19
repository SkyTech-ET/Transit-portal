"use client";

import { ChangeEvent } from "react";

import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";


interface Props {
    searchTerm: string;
    onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
}


const VendorTableSearch = (props: Props) => {
    return (
        <div className="flex flex-row md:w-64 px-6">
            <Input
                allowClear={true}
                value={props.searchTerm}
                placeholder="Search vendor..."
                onChange={props.onSearch}
                prefix={<SearchOutlined />}
            />
        </div>
    );
}


export default VendorTableSearch;