"use client";

import { Table } from "antd";
import { IContact } from "@/modules/contact";
import { ContactTableColumn } from "./ContactTableColumn";

interface Props {
    loading: boolean,
    contacts: IContact[]
}

const ContactTable = (props: Props) => {
   
    return (<>
        <Table
            id="id"
            size="small"
            loading={props.loading}
            dataSource={props.contacts}
            className="shadow-sm px-6"
            scroll={{ x: 700 }}
            columns={ContactTableColumn()}
            pagination={{
                position: ["bottomLeft"],
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
        />
    </>)
}

export default ContactTable;