import { apiClient } from "./api-client";

export const submissionApi = {
  // Get all submissions for the current seller
  getMySubmissions: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await apiClient.seller.get(`/api/v1/submissions/me`, {
      params,
    });
    return response.data;
  },

  // Get details for a specific submission
  getSubmission: async (submissionId: string) => {
    const response = await apiClient.seller.get(
      `/api/v1/submissions/${submissionId}`
    );
    return response.data;
  },

  // Create a new submission
  createSubmission: async (data: any) => {
    const response = await apiClient.seller.post("/api/v1/submissions", data);
    return response;
  },

  // Cancel a submission
  cancelSubmission: async (submissionId: string, reason: string) => {
    const response = await apiClient.seller.post(
      `/api/v1/submissions/${submissionId}/cancel`,
      { reason }
    );
    return response.data;
  },
  resubmitSubmission: async (submissionId: string, message?: string) => {
    const response = await apiClient.seller.post(
      `/submissions/${submissionId}/resubmit`,
      {
        message: message || "Submission updated and resubmitted for review.",
      }
    );
    return response.data;
  },

  // Chat functionality
  getMessages: async (
    submissionId: string,
    limit?: number,
    before?: string
  ) => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (before) params.before = before;

    const response = await apiClient.seller.get(
      `/api/v1/submissions/${submissionId}/messages`,
      { params }
    );
    return response.data;
  },

  sendMessage: async (
    submissionId: string,
    text: string,
    attachments: any[] = []
  ) => {
    const response = await apiClient.seller.post(
      `/api/v1/submissions/${submissionId}/messages`,
      {
        text,
        attachments,
      }
    );
    return response.data;
  },

  markMessagesAsRead: async (submissionId: string) => {
    const response = await apiClient.seller.post(
      `/api/v1/submissions/${submissionId}/messages/read`,
      {}
    );
    return response.data;
  },
};
