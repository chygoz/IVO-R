import { fetchAPI } from "../config";
import { COLLECTION_BASE_URL } from "./config";
import { CollectionResponse } from "./types";

export const getMyCollections = async (): Promise<CollectionResponse> => {
  const res = await fetchAPI({
    url: `${COLLECTION_BASE_URL}/me`,
  });

  return res;
};
