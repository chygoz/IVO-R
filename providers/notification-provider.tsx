"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";

import { useRouter } from "next/navigation";
import * as notificationAPI from "@/actions/notification";
import { notificationClient } from "@/lib/notification-client";
import { useAuth } from "@/contexts/auth-context";

// Define notification type
export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "transaction" | "order" | "system" | "welcome" | "organisation";
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Define pagination type
interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Define context type
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  pagination: Pagination;
  fetchNotifications: (
    page?: number,
    limit?: number,
    unreadOnly?: boolean
  ) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  handleNotificationClick: (notification: Notification) => void;
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Provider props
interface NotificationProviderProps {
  children: ReactNode;
  apiUrl?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  apiUrl = process.env.NEXT_PUBLIC_API_URL,
}) => {
  // State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Create refs to prevent infinite loops
  const initialFetchedRef = useRef<boolean>(false);

  // Get session and router
  const { user } = useAuth();
  const router = useRouter();
  // Set base URL if provided
  useEffect(() => {
    if (apiUrl) {
      notificationClient.setBaseUrl(apiUrl);
    }
  }, [apiUrl]);

  // Initialize notification client when session changes
  useEffect(() => {
    if (user?.token) {
      notificationClient.initialize(user.token as string);
      // When token changes, reset the fetch status
      initialFetchedRef.current = false;
    } else {
      notificationClient.disconnect();
      // Reset state when disconnected
      setNotifications([]);
      setUnreadCount(0);
      setIsConnected(false);
      initialFetchedRef.current = false;
    }
  }, [user]);

  // Memoize fetchUnreadCount to prevent recreation on each render
  const fetchUnreadCount = useCallback(async () => {
    try {
      console.log("Fetching unread count...");
      const response = await notificationAPI.getUnreadCount();
      console.log("Unread count response:", response);
      if (response.success) {
        setUnreadCount(response.data.count);
        console.log("Unread count set to:", response.data.count);
      } else {
        console.error("Failed to fetch unread count:", response.message);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, []);

  // Memoize fetchNotifications to prevent recreation on each render
  const fetchNotifications = useCallback(
    async (
      page: number = 1,
      limit: number = 10,
      unreadOnly: boolean = false
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to fetch using WebSocket first
        if (isConnected) {
          try {
            const result = await notificationClient.getNotifications(
              page,
              limit,
              unreadOnly
            );
            setNotifications(result.notifications);
            setPagination(result.pagination);
            return;
          } catch (socketErr) {
            console.warn(
              "WebSocket fetch failed, falling back to REST API",
              socketErr
            );
          }
        }

        // Fallback to REST API
        const response = await notificationAPI.getNotifications(
          page,
          limit,
          unreadOnly
        );

        if (response.success) {
          setNotifications(response.data.notifications);
          setPagination(response.data.pagination);
        } else {
          throw new Error(response.message || "Failed to fetch notifications");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch notifications"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected]
  );

  // Set up event listeners - separated from the initial fetch to prevent infinite loops
  useEffect(() => {
    if (!user?.token) return;

    // Connection status change
    const connectionListener = (connected: boolean) => {
      console.log("Connection status changed:", connected);
      setIsConnected(connected);

      // When connection is established, reset fetch status to ensure data is loaded
      if (connected && initialFetchedRef.current) {
        initialFetchedRef.current = false;
      }
    };

    // New notification received
    const newNotificationListener = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      // Update unread count if notification is unread
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    // Notification updated
    const updateNotificationListener = (data: {
      notificationId: string;
      read: boolean;
    }) => {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === data.notificationId
            ? { ...notif, read: data.read }
            : notif
        )
      );

      // Update unread count if notification was marked as read
      if (data.read) {
        const wasUnread = notifications.find(
          (n) => n._id === data.notificationId && !n.read
        );
        if (wasUnread && unreadCount > 0) {
          setUnreadCount((prev) => prev - 1);
        }
      }
    };

    // Notification deleted
    const deleteNotificationListener = (notificationId: string) => {
      // Check if notification was unread before removing
      const notif = notifications.find((n) => n._id === notificationId);
      const wasUnread = notif && !notif.read;

      // Remove notification
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );

      // Update unread count if needed
      if (wasUnread && unreadCount > 0) {
        setUnreadCount((prev) => prev - 1);
      }
    };

    // All notifications marked as read
    const allReadListener = () => {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    };

    // Unread count update
    const unreadCountListener = (count: number) => {
      setUnreadCount(count);
    };

    // Connection error
    const errorListener = (err: Error) => {
      setError(`Connection error: ${err.message}`);
    };

    // Register listeners
    const unregisterConnection = notificationClient.on(
      "connection:change",
      connectionListener
    );
    const unregisterNew = notificationClient.on(
      "notification:new",
      newNotificationListener
    );
    const unregisterUpdate = notificationClient.on(
      "notification:updated",
      updateNotificationListener
    );
    const unregisterDelete = notificationClient.on(
      "notification:deleted",
      deleteNotificationListener
    );
    const unregisterAllRead = notificationClient.on(
      "notification:all-read",
      allReadListener
    );
    const unregisterUnreadCount = notificationClient.on(
      "notification:unread-count",
      unreadCountListener
    );
    const unregisterError = notificationClient.on(
      "connection:error",
      errorListener
    );

    // Cleanup listeners on unmount
    return () => {
      unregisterConnection();
      unregisterNew();
      unregisterUpdate();
      unregisterDelete();
      unregisterAllRead();
      unregisterUnreadCount();
      unregisterError();
    };
  }, [user, notifications, unreadCount]);

  // Add a standalone useEffect specifically for unread count
  useEffect(() => {
    // Only fetch unread count when connected
    if (isConnected && user?.token) {
      // Fetch unread count immediately
      fetchUnreadCount();

      // Then at regular intervals
      const intervalId = setInterval(() => {
        fetchUnreadCount();
      }, 60000); // 1 minute

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isConnected, user?.token, fetchUnreadCount]);

  // Add separate effect for initial notifications fetch
  useEffect(() => {
    // Only fetch notifications if connected and hasn't fetched yet
    if (isConnected && user?.token && !initialFetchedRef.current) {
      const initialFetch = async () => {
        try {
          initialFetchedRef.current = true;
          await fetchNotifications();
          console.log("Initial notifications fetch complete");
        } catch (err) {
          console.error("Failed to fetch initial notifications", err);
          initialFetchedRef.current = false;
        }
      };

      initialFetch();
    }
  }, [isConnected, user?.token, fetchNotifications]);

  /**
   * Mark notification as read
   * @param notificationId Notification ID
   */
  const markAsRead = useCallback(
    async (notificationId: string): Promise<void> => {
      setError(null);

      try {
        // Try WebSocket first
        if (isConnected) {
          try {
            await notificationClient.markAsRead(notificationId);

            // Update local state
            setNotifications((prev) =>
              prev.map((notif) =>
                notif._id === notificationId ? { ...notif, read: true } : notif
              )
            );

            // Update unread count
            const wasUnread = notifications.find(
              (n) => n._id === notificationId && !n.read
            );
            if (wasUnread && unreadCount > 0) {
              setUnreadCount((prev) => prev - 1);
            }

            return;
          } catch (socketErr) {
            console.warn(
              "WebSocket operation failed, falling back to REST API",
              socketErr
            );
          }
        }

        // Fallback to REST API
        const response = await notificationAPI.markAsRead(notificationId);

        if (response.success) {
          // Update local state
          setNotifications((prev) =>
            prev.map((notif) =>
              notif._id === notificationId ? { ...notif, read: true } : notif
            )
          );

          // Update unread count
          const wasUnread = notifications.find(
            (n) => n._id === notificationId && !n.read
          );
          if (wasUnread && unreadCount > 0) {
            setUnreadCount((prev) => prev - 1);
          }
        } else {
          throw new Error(
            response.message || "Failed to mark notification as read"
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to mark notification as read"
        );
      }
    },
    [isConnected, notifications, unreadCount]
  );

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async (): Promise<void> => {
    setError(null);

    try {
      // Try WebSocket first
      if (isConnected) {
        try {
          await notificationClient.markAllAsRead();

          // Update local state
          setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, read: true }))
          );

          // Update unread count
          setUnreadCount(0);

          return;
        } catch (socketErr) {
          console.warn(
            "WebSocket operation failed, falling back to REST API",
            socketErr
          );
        }
      }

      // Fallback to REST API
      const response = await notificationAPI.markAllAsRead();

      if (response.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );

        // Update unread count
        setUnreadCount(0);
      } else {
        throw new Error(
          response.message || "Failed to mark all notifications as read"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read"
      );
    }
  }, [isConnected]);

  /**
   * Delete notification
   * @param notificationId Notification ID
   */
  const deleteNotification = useCallback(
    async (notificationId: string): Promise<void> => {
      setError(null);

      try {
        // Find notification before deletion to check if it was unread
        const notif = notifications.find((n) => n._id === notificationId);
        const wasUnread = notif && !notif.read;

        // Try WebSocket first
        if (isConnected) {
          try {
            await notificationClient.deleteNotification(notificationId);

            // Update local state
            setNotifications((prev) =>
              prev.filter((notif) => notif._id !== notificationId)
            );

            // Update unread count if the notification was unread
            if (wasUnread && unreadCount > 0) {
              setUnreadCount((prev) => prev - 1);
            }

            return;
          } catch (socketErr) {
            console.warn(
              "WebSocket operation failed, falling back to REST API",
              socketErr
            );
          }
        }

        // Fallback to REST API
        const response = await notificationAPI.deleteNotification(
          notificationId
        );

        if (response.success) {
          // Update local state
          setNotifications((prev) =>
            prev.filter((notif) => notif._id !== notificationId)
          );

          // Update unread count if the notification was unread
          if (wasUnread && unreadCount > 0) {
            setUnreadCount((prev) => prev - 1);
          }
        } else {
          throw new Error(response.message || "Failed to delete notification");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete notification"
        );
      }
    },
    [isConnected, notifications, unreadCount]
  );

  /**
   * Handle notification click - navigate based on notification type
   * @param notification Notification to handle
   */
  const handleNotificationClick = useCallback(
    (notification: Notification): void => {
      // Mark as read if unread
      if (!notification.read) {
        markAsRead(notification._id);
      }

      // Navigate based on notification type and metadata
      switch (notification.type) {
        case "transaction":
          if (notification.metadata?.orderId) {
            router.push(`/account/orders/${notification.metadata.orderId}`);
          } else {
            router.push("/account/transactions");
          }
          break;

        case "order":
          if (notification.metadata?.bookingId) {
            router.push(`/account/orders/${notification.metadata.bookingId}`);
          } else {
            router.push("/account");
          }
          break;

        case "system":
          router.push("/notifications"); // Go to all notifications page
          break;

        case "welcome":
          router.push("/account"); // Go to dashboard
          break;

        case "organisation":
          router.push("/dashboard"); // Go to business page
          break;

        default:
          router.push("/notifications");
      }
    },
    [markAsRead, router]
  );

  // Context value
  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    isConnected,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationClick,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
