
import { fetchAPI } from "@/actions/config";

type VerifyPayload = {
    tx_ref: string;
    status: string;
    transactionId: string;
};

const verifyPayment = async (payload: VerifyPayload): Promise<{
    success: boolean;
    message?: string;
}> => {
    const res = await fetchAPI({
        url: "/api/v1/payments/verify",
        method: "POST",
        body: payload,
    });

    if (res?.error) {
        return {
            success: false,
            message: res.error.message || "Verification failed",
        };
    }

    return {
        success: true,
        message: res.message || "Payment verified successfully",
    };
};

export default verifyPayment;
