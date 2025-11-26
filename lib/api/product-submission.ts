import { Product } from "@/store/product-store";
import { useProductStore } from "@/store/product-store";
import { syncProductToAPI } from "@/lib/api/product-sync";
import { submissionApi } from "@/lib/api/submissions";

/**
 * Submits products for approval
 *
 * @param productIds Array of product IDs to submit for approval
 * @param submissionName Optional name for the submission
 * @param message Optional message to include with the submission
 * @returns Result object with success status and optional error
 */
export const submitProductsForApproval = async (
  productIds: string[],
  submissionName?: string,
  message?: string
): Promise<{
  success: boolean;
  submissionId?: string;
  error?: string;
}> => {
  try {
    // Get the product store state
    const productStore = useProductStore.getState();

    // 1. First, ensure all products are synced with API
    const syncPromises = productIds.map(async (productId) => {
      const product = productStore.drafts.find((p) => p._id === productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found in drafts`);
      }

      // Sync product to API
      const syncResult = await syncProductToAPI(productId, product);

      if (!syncResult) {
        throw new Error(`Failed to sync product ${productId}`);
      }

      return syncResult;
    });

    // Wait for all sync operations to complete
    await Promise.all(syncPromises);

    // 2. Create the submission payload
    const submissionPayload = {
      type: "product",
      category: "add",
      items: productIds,
      name: submissionName || `Submission ${new Date().toLocaleString()}`,
      message: message || undefined,
    };

    // 3. Create the submission using the API
    const result = await submissionApi.createSubmission(submissionPayload);

    // 4. If submission is successful, update the local store
    if (result && result.success) {
      // Update products status to 'pending' in the store
      productIds.forEach((productId) => {
        productStore.updateDraft(productId, { status: "pending" });
      });

      return {
        success: true,
        submissionId: result.submissionId,
      };
    } else {
      return {
        success: false,
        error: "Failed to create submission. No submission ID returned.",
      };
    }
  } catch (error) {
    console.error("Error submitting products for approval:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Validates a product for submission
 *
 * @param product Product to validate
 * @returns Object containing validation results
 */
export const validateProductForSubmission = (
  product: Product
): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  // Check required fields
  if (!product.name) issues.push("Product name is required");
  if (!product.description) issues.push("Product description is required");
  if (!product.category?._id) issues.push("Product category is required");

  // Check price
  if (!product.basePrice?.value) issues.push("Base price is required");

  // Check variants
  if (!product.variants || product.variants.length === 0) {
    issues.push("At least one variant is required");
  } else {
    // Check each variant
    product.variants.forEach((variant, index) => {
      if (!variant.name) issues.push(`Variant ${index + 1} name is required`);
      if (!variant.code) issues.push(`Variant ${index + 1} code is required`);

      // Check sizes
      if (!variant.sizes || variant.sizes.length === 0) {
        issues.push(`Variant ${index + 1} must have at least one size`);
      }

      // Check gallery
      if (!variant.gallery || variant.gallery.length === 0) {
        issues.push(`Variant ${index + 1} must have at least one image`);
      }
    });
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};

/**
 * Cancels a submission
 *
 * @param submissionId Submission ID to cancel
 * @param reason Reason for cancellation
 * @returns Result object with success status
 */
export const cancelSubmission = async (
  submissionId: string,
  reason: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const response = await submissionApi.cancelSubmission(submissionId, reason);

    if (response && response.success) {
      // Get the product store
      const productStore = useProductStore.getState();

      // Find the submission to get the product IDs
      const submission = await submissionApi.getSubmission(submissionId);

      if (submission && submission.items) {
        // Update products status back to 'draft'
        submission.items.forEach((productId: string) => {
          productStore.updateDraft(productId, { status: "draft" });
        });
      }

      return {
        success: true,
      };
    }

    return {
      success: false,
      error: "Failed to cancel submission",
    };
  } catch (error) {
    console.error("Error canceling submission:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Resubmits products after rejection
 *
 * @param submissionId Submission ID to resubmit
 * @param message Optional message for resubmission
 * @returns Result object with success status
 */
export const resubmitProducts = async (
  submissionId: string,
  message?: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Get the product store
    const productStore = useProductStore.getState();

    // Get submission details to get product IDs
    const submission = await submissionApi.getSubmission(submissionId);

    if (!submission || !submission.items || submission.items.length === 0) {
      return {
        success: false,
        error: "No products found in this submission",
      };
    }

    // 1. First, ensure all products are synced with API again
    const productIds = submission.items;
    const syncPromises = productIds.map(async (productId: string) => {
      const product = productStore.drafts.find((p) => p._id === productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found in drafts`);
      }

      // Sync product to API
      const syncResult = await syncProductToAPI(productId, product);

      if (!syncResult) {
        throw new Error(`Failed to sync product ${productId}`);
      }

      return syncResult;
    });

    // Wait for all sync operations to complete
    await Promise.all(syncPromises);

    // 2. Resubmit the submission
    const result = await submissionApi.resubmitSubmission(
      submissionId,
      message || "Products updated and resubmitted for review."
    );

    if (result && result.success) {
      // Update products status to 'pending' in the store
      productIds.forEach((productId: string) => {
        productStore.updateDraft(productId, { status: "pending" });
      });

      return {
        success: true,
      };
    }

    return {
      success: false,
      error: "Failed to resubmit products",
    };
  } catch (error) {
    console.error("Error resubmitting products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Gets all submissions for the current user
 *
 * @param status Optional status filter
 * @returns Result object with submissions array
 */
export const getMySubmissions = async (
  status?: string
): Promise<{
  success: boolean;
  submissions?: any[];
  error?: string;
}> => {
  try {
    const response = await submissionApi.getMySubmissions(status);

    return {
      success: true,
      submissions: response.submissions || [],
    };
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch submissions",
    };
  }
};

/**
 * Gets details of a specific submission
 *
 * @param submissionId Submission ID to retrieve
 * @returns Result object with submission details
 */
export const getSubmissionDetails = async (
  submissionId: string
): Promise<{
  success: boolean;
  submission?: any;
  error?: string;
}> => {
  try {
    const response = await submissionApi.getSubmission(submissionId);

    return {
      success: true,
      submission: response,
    };
  } catch (error) {
    console.error("Error fetching submission details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch submission details",
    };
  }
};

/**
 * Sends a message on a submission
 *
 * @param submissionId Submission ID
 * @param text Message text
 * @param attachments Optional attachments
 * @returns Result object with message details
 */
export const sendSubmissionMessage = async (
  submissionId: string,
  text: string,
  attachments: any[] = []
): Promise<{
  success: boolean;
  message?: any;
  error?: string;
}> => {
  try {
    const response = await submissionApi.sendMessage(
      submissionId,
      text,
      attachments
    );

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
};

/**
 * Gets messages for a submission
 *
 * @param submissionId Submission ID
 * @param limit Optional limit of messages
 * @param before Optional pagination cursor
 * @returns Result object with messages array
 */
export const getSubmissionMessages = async (
  submissionId: string,
  limit?: number,
  before?: string
): Promise<{
  success: boolean;
  messages?: any[];
  error?: string;
}> => {
  try {
    const response = await submissionApi.getMessages(
      submissionId,
      limit,
      before
    );

    return {
      success: true,
      messages: response.messages || [],
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch messages",
    };
  }
};

/**
 * Marks all messages in a submission as read
 *
 * @param submissionId Submission ID
 * @returns Result object with success status
 */
export const markMessagesAsRead = async (
  submissionId: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await submissionApi.markMessagesAsRead(submissionId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to mark messages as read",
    };
  }
};
