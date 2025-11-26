export async function updateSubscription(planCode: string): Promise<boolean> {
  try {
    const response = await fetch("/api/subscription/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planCode }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error updating subscription:", error);
    return false;
  }
}

export async function cancelSubscription(): Promise<boolean> {
  try {
    const response = await fetch("/api/subscription/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return false;
  }
}

export async function toggleAutoRenew(enable: boolean): Promise<boolean> {
  try {
    const response = await fetch("/api/subscription/auto-renew", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enable }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error toggling auto-renew:", error);
    return false;
  }
}

export async function downloadInvoice(invoiceId: string): Promise<Blob | null> {
  try {
    const response = await fetch(`/api/invoices/${invoiceId}/download`);

    if (!response.ok) {
      throw new Error("Failed to download invoice");
    }

    return await response.blob();
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return null;
  }
}
