"use client";

import { io, Socket } from "socket.io-client";

/**
 * Client-side notification service for real-time notifications
 */
class NotificationClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private baseUrl: string;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private listeners: Map<string, Set<Function>> = new Map();
  private unreadCount: number = 0;

  /**
   * Create a new NotificationClient
   * @param baseUrl WebSocket server URL
   */
  constructor(baseUrl: string = "") {
    this.baseUrl =
      baseUrl ||
      (typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.host}`
        : "http://localhost:3000");
  }

  /**
   * Set the base URL for WebSocket connection
   * @param url Base URL for the WebSocket server
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;

    // Reconnect if already connected
    if (this.socket && this.connected && this.token) {
      this.disconnect();
      this.initialize(this.token);
    }
  }

  /**
   * Initialize WebSocket connection
   * @param token JWT token for authentication
   */
  initialize(token: string): void {
    if (typeof window === "undefined") return; // Only initialize in browser

    if (this.socket && this.connected) {
      // Already connected
      return;
    }

    this.token = token;
    this.reconnectAttempts = 0;

    // Connect to WebSocket server
    this.connect();
  }

  /**
   * Connect to WebSocket server
   */
  private connect(): void {
    if (!this.token || typeof window === "undefined") {
      console.error("Token is required for WebSocket connection");
      return;
    }

    // Create socket connection
    this.socket = io(this.baseUrl, {
      auth: { token: this.token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    // Set up event handlers
    this.setupSocketHandlers();
  }

  /**
   * Set up WebSocket event handlers
   */
  private setupSocketHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("Connected to notification server");
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emitEvent("connection:change", true);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from notification server");
      this.connected = false;
      this.emitEvent("connection:change", false);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      this.reconnectAttempts++;
      this.emitEvent("connection:error", error);

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
        this.disconnect();
        this.emitEvent("connection:max-attempts");
      }
    });

    // Notification events
    this.socket.on("notifications:new", (data) => {
      this.unreadCount++;
      this.emitEvent("notification:new", data.notification);
      this.emitEvent("notification:unread-count", this.unreadCount);
    });

    this.socket.on("notifications:updated", (data) => {
      this.emitEvent("notification:updated", data);
    });

    this.socket.on("notifications:deleted", (data) => {
      this.emitEvent("notification:deleted", data.notificationId);
    });

    this.socket.on("notifications:all-read", () => {
      this.unreadCount = 0;
      this.emitEvent("notification:all-read");
      this.emitEvent("notification:unread-count", this.unreadCount);
    });

    this.socket.on("notifications:unread-count", (data) => {
      this.unreadCount = data.count;
      this.emitEvent("notification:unread-count", this.unreadCount);
    });

    // Business events
    this.socket.on("business:update", (data) => {
      this.emitEvent("business:update", data);
    });
  }

  /**
   * Emit event to registered listeners
   * @param event Event name
   * @param data Event data
   */
  private emitEvent(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error(
            `Error in notification listener for event "${event}":`,
            error
          );
        }
      });
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
    this.emitEvent("connection:change", false);
  }

  /**
   * Check if client is connected
   * @returns Connection status
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Register event listener
   * @param event Event name
   * @param callback Event callback
   * @returns Unregister function
   */
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    // Return unregister function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Get all notifications
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 20)
   * @param unreadOnly Only get unread notifications (default: false)
   * @returns Promise with notifications and pagination
   */
  getNotifications(
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.connected) {
        reject(new Error("Not connected to notification server"));
        return;
      }

      this.socket.emit(
        "notifications:get",
        { page, limit, unreadOnly },
        (response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(
              new Error(response.error || "Failed to fetch notifications")
            );
          }
        }
      );
    });
  }

  /**
   * Mark notification as read
   * @param notificationId Notification ID
   * @returns Promise with updated notification
   */
  markAsRead(notificationId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.connected) {
        reject(new Error("Not connected to notification server"));
        return;
      }

      this.socket.emit(
        "notifications:mark-read",
        { notificationId },
        (response: any) => {
          if (response.success) {
            if (this.unreadCount > 0) {
              this.unreadCount--;
              this.emitEvent("notification:unread-count", this.unreadCount);
            }
            resolve(response.data);
          } else {
            reject(
              new Error(response.error || "Failed to mark notification as read")
            );
          }
        }
      );
    });
  }

  /**
   * Mark all notifications as read
   * @returns Promise with success status
   */
  markAllAsRead(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.connected) {
        reject(new Error("Not connected to notification server"));
        return;
      }

      this.socket.emit("notifications:mark-all-read", {}, (response: any) => {
        if (response.success) {
          this.unreadCount = 0;
          this.emitEvent("notification:unread-count", this.unreadCount);
          resolve(response);
        } else {
          reject(
            new Error(
              response.error || "Failed to mark all notifications as read"
            )
          );
        }
      });
    });
  }

  /**
   * Delete notification
   * @param notificationId Notification ID
   * @returns Promise with success status
   */
  deleteNotification(notificationId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.connected) {
        reject(new Error("Not connected to notification server"));
        return;
      }

      this.socket.emit(
        "notifications:delete",
        { notificationId },
        (response: any) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(
              new Error(response.error || "Failed to delete notification")
            );
          }
        }
      );
    });
  }

  /**
   * Get unread notification count
   * @returns Current unread count
   */
  getUnreadCount(): number {
    return this.unreadCount;
  }
}

// Create singleton instance
const notificationClient = new NotificationClient();

export { notificationClient };
