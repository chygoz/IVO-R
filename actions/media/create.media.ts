import { fetchAPI } from "../config";
import { MEDIA_BASE_URL } from "./config";
import { CreateMediaResponse } from "./types";

export const createMedia = async (
  formData: FormData
): Promise<CreateMediaResponse> => {
  const res = await fetchAPI({
    url: `${MEDIA_BASE_URL}`,
    method: "POST",
    body: formData,
    form: true,
  });

  if (res?.error) {
    throw new Error(res.details);
  }

  return res;
};
