const permission = {
    vendor: {
        getAll: "Organazations-GetAll",
        create: "Organazations-Create",
        update: "Organazations-Update",
        delete: "Organazations-Delete",
        getById: "Organazations-GetById",
        updateStatus: "Organazations-UpdateStatus",
        getAllSort: "Organazations-GetAllSortData",
        
    },
    user: {
        getAll: "User-GetAll",
        create: "User-Create",
        update: "User-Update",
        delete: "User-Delete",
        getById: "User-GetById",
        getByOrg: "User-GetByOrganization",
        logout: "User-Logout",
    },
    event: {
        getAll: "Events-GetAll",
        create: "Events-Create",
        update: "Events-Update",
        delete: "Events-Delete",
        getById: "Events-GetById",
        getByOrg: "Events-GetByOrganizationId"
    },
    contact: {
        getAll: "Contacts-GetAll",
        create: "Contact-Create",
        update: "Contact-Update",
        delete: "Contact-Delete",
        getById: "Contact-GetById",
        getByOrg: "Contacts-GetByOrganizationId"
    },
    banner: {
        getAll: "Banners-GetAll",
        create: "Banners-Create",
        update: "Banners-Update",
        delete: "Banners-Delete",
        getById: "Banners-GetById",
        getByOrg: "Banners-GetByOrganizationId"
    },
    package: {
        getAll: "Packages-GetAll",
        create: "Packages-Create",
        update: "Packages-Update",
        delete: "Packages-Delete",
        getById: "Packages-GetById",
        getByOrg: "Packages-GetByOrganizationId"
    },
    service: {
        getAll: "Services-GetAll",
        create: "Services-Create",
        update: "Services-Update",
        delete: "Services-Delete",
        getById: "Services-GetById",
        getByOrg: "Services-GetByOrganizationId"
    },
    booking: {
        getAll: "Bookings-GetAll",
        create: "Bookings-Create",
        update: "Bookings-Update",
        delete: "Bookings-Delete",
        getById: "Bookings-GetById",
        getByOrg: "Bookings-GetByOrganizationId",
        updateStatus:"Bookings-UpdateOrderStatus"
    },
    role: {
        getAll: "Roles-GetAll",
        create: "Roles-Create",
        update: "Roles-Update",
        delete: "Roles-Delete",
        getById: "Role-GetById",
        getByUser: "Roles-GetRolesByUser"
    },
    privilege: {
        getAll: "Privilege-GetAll",
        create: "Privilege-Create",
        update: "Privilege-Update",
        delete: "Privilege-Delete",
    },
    subscription: {
        create: "Subscriptions-Create",
        update: "Subscriptions-Update",
        updateAccStatus: "Subscriptions-UpdateAccountStatus",
        updateReqStatus: "Subscriptions-UpdateRequestStatus",
        delete: "Subscriptions-Delete",
        getById: "Subscriptions-GetById",
        getByOrgId: "Subscriptions-GetSubscriptionHistory",
        getAll: "Subscriptions-GetAll",
    },
    vendorSubscription: {
        create: "Subscriptions-Create",
        update: "Subscriptions-Update",
        updateAccStatus: "Subscriptions-UpdateAccountStatus",
        updateReqStatus: "Subscriptions-UpdateRequestStatus",
        delete: "Subscriptions-Delete",
        getById: "Subscriptions-GetById",
        getByOrgId: "Subscriptions-GetSubscriptionHistory",
        getAll: "Subscriptions-GetAll",
    },
    tag: {
        create: "Tags-Create",
        update: "Tags-Update",
        delete: "Tags-Delete",
        getById: "Tags-GetById",
        getAll: "Tags-GetAll",
    },
    subscriptionPackage: {
        create: "SubscriptionPackages-Create",
        update: "SubscriptionPackages-Update",
        delete: "SubscriptionPackages-Delete",
        getById: "SubscriptionPackages-GetById",
        getAll: "SubscriptionPackages-GetAll",
    },
    password: {
        changePassword: "Password-ChangePassword",
        resetPassword: "Password-ResetPassword",
    },
    order: {
        getByOrg: "Orders-GetByOrganization",
        getAll: "Orders-FilterOrders",
        madePayment: "Orders-MadePayment",
        create: "Order-Create",
        update: "Order-Update",
        delete: "Order-Delete",
        getById: "Order-GetById",
    },
    dashboard: {
        getByOrg: "Dashboards-GetOrganizationDashboardData",
        getAll: "Dashboards-GetAdminDashboardDataQuery",
        getByOrgSort: "Dashboards-GetByOrganizationIdWithDateSort",
        getAllSort: "Dashboards-GetAdminDashboardDataSortQuery",
    },
    document: {
        getByOrg: "Documents-GetByOrganization",
        getAll: "Documents-GetAll",
    },
    docAnalyzer: {
        uploader: "CognitiveServices-AnalyzePdf"
    },
    // MOT System Permissions
    motService: {
        getAll: "Service-GetAll",
        create: "Service-Create",
        update: "Service-Update",
        delete: "Service-Delete",
        getById: "Service-GetById",
        updateStatus: "Service-UpdateStatus",
        assign: "Service-Assign"
    },
    motCustomer: {
        getAll: "Customer-GetAll",
        create: "Customer-Create",
        update: "Customer-Update",
        delete: "Customer-Delete",
        getById: "Customer-GetById",
        approve: "Customer-Approve"
    },
    motDocument: {
        upload: "Document-Upload",
        download: "Document-Download",
        verify: "Document-Verify",
        delete: "Document-Delete",
        getAll: "Document-GetAll"
    },
    motMessage: {
        send: "Message-Send",
        getAll: "Message-GetAll",
        getById: "Message-GetById"
    },
    motNotification: {
        create: "Notification-Create",
        getAll: "Notification-GetAll",
        markAsRead: "Notification-MarkAsRead"
    },
    motReport: {
        getAll: "Report-GetAll",
        export: "Report-Export"
    },
    motDashboard: {
        view: "Dashboard-View",
        manager: "Dashboard-Manager",
        assessor: "Dashboard-Assessor",
        caseExecutor: "Dashboard-CaseExecutor",
        dataEncoder: "Dashboard-DataEncoder",
        customers: "Dashboard-Customer"
    }

}

export default permission;