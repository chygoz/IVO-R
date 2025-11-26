import { fetchAPI } from "./config";
import { CreateShipping, UserShipping } from "./types";
// /api/v1/users/me/shippings


const newUserShipping = async (
  newShipping: CreateShipping
): Promise<{
  success: boolean;
  message?: string; data?: UserShipping[]
}> => {
  const res = await fetchAPI({
    method: "POST",
    url: "/api/v1/shippings/address",
    body: {
      newShipping,
    },
  });


  try {
    if (res.error) {
      throw Error(res.details || "Unknown error");
    }

    return {
      success: res.success || false,
      data: res.data,
      message: res.message || "Successfully created shipping address",

    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to create shipping address",

    }
  }
};

export default newUserShipping;
