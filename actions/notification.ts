import { fetchAPI } from "./config";

// Get notifications
export async function getNotifications(
  page = 1,
  limit = 10,
  unreadOnly = false
) {
  return fetchAPI({
    url: `/api/v1/notifications?page=${page}&limit=${limit}${unreadOnly ? "&unreadOnly=true" : ""
      }`,
    method: "GET",
    includeCredential: true,
  });
}

// Get unread count
export async function getUnreadCount() {
  console.log("getting unrread");
  return fetchAPI({
    url: "/api/v1/notifications/unread-count",
    includeCredential: true,
  });
}

// Mark notification as read
export async function markAsRead(notificationId: string) {
  return fetchAPI({
    url: `/api/v1/notifications/${notificationId}/read`,
    method: "PATCH",
    includeCredential: true,
  });
}

// Mark all notifications as read
export async function markAllAsRead() {
  return fetchAPI({
    url: "/api/v1/notifications/read-all",
    method: "PATCH",
    includeCredential: true,
  });
}

// Delete notification
export async function deleteNotification(notificationId: string) {
  return fetchAPI({
    url: `/api/v1/notifications/${notificationId}`,
    method: "DELETE",
    includeCredential: true,
  });
}

// Get notification preferences
export async function getNotificationPreferences() {
  return fetchAPI({
    url: "/api/v1/notifications/preferences",
    method: "GET",
    includeCredential: true,
  });
}

// Update notification preferences
export async function updateNotificationPreferences(preferences: any) {
  return fetchAPI({
    url: "/api/v1/notifications/preferences",
    method: "PATCH",
    body: preferences,
    includeCredential: true,
  });
}
