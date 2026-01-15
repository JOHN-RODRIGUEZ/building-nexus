import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Contract Expiring Soon',
    message: 'The contract for Tech Hub E with StartupXYZ expires in 15 days.',
    type: 'warning',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Contract Expired',
    message: 'The contract for Executive Suite A with LegalFirm LLP has expired.',
    type: 'error',
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'New Environment Available',
    message: 'Creative Studio C is now available for rent.',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    title: 'Rent Payment Received',
    message: 'Monthly rent payment received from TechCorp Inc.',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  fetchNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const unread = mockNotifications.filter(n => !n.read).length;
    set({ notifications: mockNotifications, unreadCount: unread });
  },
  
  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      const unread = updated.filter(n => !n.read).length;
      return { notifications: updated, unreadCount: unread };
    });
  },
  
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
