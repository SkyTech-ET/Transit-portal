import React from "react";
import { reportRoutes } from "@/modules/report";
import { userRoutes } from "@/modules/user/user.routes";
import { roleRoutes } from "@/modules/role/role.routes";
import permission from "@/modules/utils/permission/permission";
import { privilegeRoutes } from "@/modules/privilege/privilege.routes";
import {Tag, Package,Repeat,Contact,Clipboard,Utensils,Menu, Image, Building2, Cog, PieChart, ShieldCheck, User, UserCog, Truck, FileText, MessageSquare, Users, CheckCircle, AlertCircle, SquareStack, LineChart } from "lucide-react";
import { contactRoutes } from "@/modules/contact";
import { serviceRoutes as motServiceRoutes } from "@/modules/mot/service/service.routes";
import { customerRoutes } from "@/modules/mot/customer/customer.routes";
import { documentRoutes } from "@/modules/mot/document/document.routes";
import { messagingRoutes } from "@/modules/mot/messaging/messaging.routes";
import { notificationRoutes } from "@/modules/mot/notification/notification.routes";
import { employeeRoutes } from "@/modules/employees/employee.routes";
import { stageoverview } from "@/modules/customers/stage-overview/stageoverview.routes";


export interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  items?: MenuItem[];
  permission?: string;
}

export const menuItems: MenuItem[] = [
  {
    key: "1",
    label: "Dashboard",
    icon: <PieChart size={18} />,
    path: reportRoutes.dashboard,
  },
  {
    key: "2",
    label: "My Services",
    icon: <Truck size={18} />,
    path: customerRoutes.services,
    permission: permission.motService.getAll
  },
  {
    key: "3",
    label: "My Documents",
    icon: <FileText size={18} />,
    path: documentRoutes.serviceDocuments,
    permission: permission.motDocument.getAll
  },
  {
    key: "4",
    label: "Messages",
    icon: <MessageSquare size={18} />,
    path: messagingRoutes.inbox,
    permission: permission.motMessage.getAll
  },
  {
    key: "5",
    label: "Notifications",
    icon: <MessageSquare size={18} />,
    path: notificationRoutes.notifications,
    permission: permission.motNotification.getAll
  },
];


export const adminMenus = [
  {
    key: "1",
    label: "Dashboard",
    icon: <PieChart size={18} />,
    path: reportRoutes.dashboard,
  },
  /* {
    key: "2",
    label: "Contact Us",
    icon: <Contact size={18} />,
    path: contactRoutes.getall,
    permission: permission.contact.getAll
  }, */
   {
    key: "4",
    label: "Stage Overview",
    icon: <LineChart size={18} />,
    path: stageoverview.getAll
  },
  {
    key: "3",
    label: "Management",
    icon: <ShieldCheck size={18} />,
    path: "",
    items: [
      /*{
         key: "3.1",
        label: "Users",
        icon: <User size={18} />,
        path: userRoutes.getall,
        permission: permission.user.getAll
      },
      {
        key: "3.2",
        label: "Roles",
        icon: <UserCog size={18} />,
        path: roleRoutes.getall,
        permission: permission.role.getAll
      },*/
      {
        key: "3.3",
        label: "Employees",
        icon: <User size={18} />,
        path: employeeRoutes.getall,
        //permission: permission.privilege.getAll
      }, 

      {
        key: "3.4",
        label: "Customer",
        icon: <User size={18} />,
        path: customerRoutes.getAll,
        //permission: permission.privilege.getAll
      },  
      
    ],
  },
 
]


export const clientMenus = [
  {
    key: "1",
    label: "Dashboard",
    icon: <PieChart size={18} />,
    path: reportRoutes.dashboard,
  },
  {
    key: "2",
    label: "Service Request",
    icon: <PieChart size={18} />,
    path: reportRoutes.dashboard,
  },
  {
    key: "3",
    label: "Tax Information",
    icon: <PieChart size={18} />,
    path: reportRoutes.dashboard,
  },
  {
    key: "3",
    label: "Notification",
    icon: <PieChart size={18} />,
    path: reportRoutes.dashboard,
  },
  {
    key: "4",
    label: "Documents",
    icon: <FileText size={18} />,
    path: reportRoutes.dashboard,
  },
  {
    key: "5",
    label: "Message Center",
    icon: <PieChart size={18} />,
    path: reportRoutes.dashboard,
  },
  {
    key: "6",
    label: "Contact US",
    icon: <PieChart size={18} />,
    path: reportRoutes.dashboard,
  },
  
      
]
  
 