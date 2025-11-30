import { fetchAPI } from "./config";
import { UserShipping } from "./types";

const getUserShipping = async (): Promise<{
  status: string;
  message?: string;
  data: UserShipping[];
}> => {
  const res = await fetchAPI({
    url: "/api/v1/shippings/address/user",
    // tags: ["my-user-shipping"],
  });

  if (!res || res.error || !res.success) {
    return { status: "failed", data: [] };
  }

  return {
    status: "success",
    message: res.message,
    data: res.data || [],
  };
};

export default getUserShipping;
