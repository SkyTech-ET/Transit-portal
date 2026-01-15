'use client';

import { useEffect, useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Zap,
  Mail,
  Layers,
  X,
  CheckCircle,
} from 'lucide-react';
import { useNotificationStore } from '@/modules/notification/notification.store';

const CATEGORY_ICONS: Record<string, any> = {
  All: Layers,
  System: Shield,
  Alert: AlertTriangle,
  Assigned: Zap,
  Message: Mail,
};

const TYPE_STYLES: Record<string, any> = {
  System: {
    border: 'border-l-yellow-400',
    icon: Shield,
    text: 'text-yellow-600',
  },
  Alert: {
    border: 'border-l-red-500',
    icon: AlertTriangle,
    text: 'text-red-600',
  },
  Assigned: {
    border: 'border-l-green-500',
    icon: Zap,
    text: 'text-green-600',
  },
  Message: {
    border: 'border-l-blue-500',
    icon: Mail,
    text: 'text-blue-600',
  },
};

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? notifications
      : notifications.filter((n) => n.type === activeCategory);

  const categoryCounts = {
    All: notifications.length,
    System: notifications.filter((n) => n.type === 'System').length,
    Alert: notifications.filter((n) => n.type === 'Alert').length,
    Assigned: notifications.filter((n) => n.type === 'Assigned').length,
    Message: notifications.filter((n) => n.type === 'Message').length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-10 py-8">
      <div className="mx-auto max-w-[1150px] grid grid-cols-[260px_1fr] gap-8">

        {/* ================= LEFT CATEGORIES ================= */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h4 className="text-xs font-semibold text-gray-400 mb-4">
            CATEGORIES
          </h4>

          <div className="space-y-1">
            {Object.keys(categoryCounts).map((key) => {
              const Icon = CATEGORY_ICONS[key];
              const isActive = activeCategory === key;

              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={
                    isActive
                      ? 'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm bg-indigo-50 text-indigo-600'
                      : 'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50'
                  }
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {key}
                  </div>

                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {categoryCounts[key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT LIST ================= */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                All Notifications
              </h2>

              {unreadCount > 0 && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>

            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              <CheckCircle className="w-4 h-4 text-gray-500" />
              Mark all as read
            </button>
          </div>

          {/* Notification Items */}
          <div className="space-y-4">
            {filtered.map((n) => {
              const style = TYPE_STYLES[n.type];
              const Icon = style.icon;

              return (
                <div
                  key={n.id}
                  className={`bg-white rounded-xl border-l-4 px-6 py-4 shadow-sm relative ${style.border}`}
                >
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                  >
                    <X size={16} />
                  </button>

                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-1 ${style.text}`} />

                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`font-semibold ${style.text}`}>
                          {n.type}
                        </span>
                        <span className="text-gray-400">
                          • {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-gray-900 font-medium mt-1">
                        {n.title}
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        {n.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center text-gray-400 py-20">
                No notifications found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
