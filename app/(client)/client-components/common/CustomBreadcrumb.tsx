import Link from "next/link"
import { Breadcrumb } from "antd"


interface Item {
    key: number,
    title: string,
    route: string
}
const CustomBreadcrumb = (props: { items: Item[] }) => {
    return (
        <Breadcrumb>
            {
                props.items.map((item) => {
                    return (<Breadcrumb.Item key={item.key}>
                        <Link href={item.route}>{item.title}</Link>
                    </Breadcrumb.Item>)
                })
            }
        </Breadcrumb>
    )
}

export default CustomBreadcrumb