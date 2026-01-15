"use client";

import { Input } from "antd";
import { ChangeEvent } from "react";
import { SearchOutlined } from "@ant-design/icons";


interface Props {
    searchTerm: string;
    placeholder: string,
    onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
}


const SearchFiled = (props: Props) => {
    return (
        <div className="flex flex-row md:w-64 px-6">
            <Input
                allowClear={true}
                value={props.searchTerm}
                placeholder={props.placeholder}
                onChange={props.onSearch}
                prefix={<SearchOutlined />}
            />
        </div>
    );
}


export default SearchFiled;