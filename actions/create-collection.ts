import {  fetchAPI } from "./config";
import { CreationCollectionResponse } from "./types";

export const createCollection = async (data: {
  name: string;
  description: string;
}): Promise<CreationCollectionResponse> => {
  const res = await fetchAPI({
    url: '/api/v1/collections',
    method: "POST",
    body: { ...data, images: ["orem"] },
  });

  if (res?.error) {
    throw new Error(res.details);
  }

  return res;
};