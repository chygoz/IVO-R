import { fetchAPI } from "../config";
import { MEDIA_BASE_URL } from "./config";
import { MediaResponse } from "./types";

export const getMyMedia = async (): Promise<MediaResponse> => {
  const res = await fetchAPI({
    url: `${MEDIA_BASE_URL}/me/list`,
    tags: ["my-media"],
  });

  if (res?.error) {
    return {
      data: {
        results: [],
      },
    };
  }

  return res;
};
