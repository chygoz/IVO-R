import { fetchAPI } from "./config";
import { CollectionResponse } from "./types";

export const getMyCollections = async (): Promise<CollectionResponse> => {
  const res = await fetchAPI({
    url: `/api/v1/collections/me`,
  });

  return res;
};