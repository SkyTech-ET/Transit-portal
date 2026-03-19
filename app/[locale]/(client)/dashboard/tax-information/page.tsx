"use client";
import { useEffect, useState } from "react";
import { Card, Table, Input, Select, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTaxInformationStore } from "@/modules/taxInformation/taxInformation.store";

const { Search } = Input;
const { Option } = Select;

export default function TaxInformationPage() {
  const { items, loading, fetchTaxInfo } = useTaxInformationStore();
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchTaxInfo();
  }, []);

  const filteredData = items.filter((item) => {
    const matchesSearch = item.productName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const columns: ColumnsType<any> = [
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => (
        <Tag
          color={
            cat === "Electronics"
              ? "blue"
              : cat === "Food & Beverages"
              ? "green"
              : "default"
          }
        >
          {cat}
        </Tag>
      ),
    },
    { title: "Tax Rate", dataIndex: "taxRate", key: "taxRate" },
    { title: "Release Date", dataIndex: "releaseDate", key: "releaseDate" },
    { title: "Country Of Origin", dataIndex: "country", key: "country" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Tax Information</h2>

      <Card className="shadow-sm">
        {/* Filters */}
        <div className="flex flex-1 gap-4 mb-4">
          <Search
            placeholder="Search goods..."
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full md:w-1/3"
          />
          <Select
            allowClear
            placeholder="All Categories"
            className="w-full md:w-1/4"
            onChange={(value) => setCategoryFilter(value)}
          >
            <Option value="Electronics">Electronics</Option>
            <Option value="Food & Beverages">Food & Beverages</Option>
          </Select>
          <Input placeholder="Tax Rate" className="w-full md:w-1/4" disabled />
          <Input placeholder="Country of Origin" className="w-full md:w-1/4" disabled />
        </div>

        {/* Table */}
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: 97,
            pageSize: 10,
            current: 2,
          }}
          footer={() => "Showing 1 to 10 of 97 results"}
        />
      </Card>
    </div>
  );
}
