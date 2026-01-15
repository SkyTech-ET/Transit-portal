// transit-portal/modules/notification/notification.mock.ts
export const mockNotifications = [
  {
    id: 1,
    userId: 1,
    title: "System Update",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: 1,
    serviceId: null,
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 1,
    title: "Security Alert",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: 2,
    serviceId: null,
    isRead: false,
    createdAt: new Date(Date.now() - 19 * 60 * 1000).toISOString(), // 19 min ago
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    userId: 1,
    title: "Platform Update",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: 3,
    serviceId: null,
    isRead: true,
    createdAt: new Date(Date.now() - 37 * 60 * 1000).toISOString(), // 37 min ago
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    userId: 1,
    title: "Welcome to the platform, Jordan!",
    message: "We're excited to have you on board. Explore our features and get started.",
    type: 4,
    serviceId: null,
    isRead: true,
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // 42 min ago
    updatedAt: new Date().toISOString()
  }
];