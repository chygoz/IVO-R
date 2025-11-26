import { fetchAPI } from "./config";

export const initiateOtp = async (data: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    sortCode: string; 
    currency:  "NGN" | "USD";
    bankId: string;
  }): Promise<{ requestId: string }> => { 
    const res = await fetchAPI({
      url: '/api/v1/accounts',
      method: "POST",
      body: data,
    });
  
    if (res?.error) {
      throw new Error(res.details || "An unknown error occurred");
    }
  
    return res 
  };
  

export const validateOtp = async (requestId: string, otp: string) => {
    const res = await fetchAPI({
        url: "/api/v1/accounts",
        method: "POST",
        body: { requestId, otp },
    });

    if (res?.error) throw new Error(res.details);
    return res;
};

