import { Metadata } from "@/types";
import { Product } from "../types";
import { fetchAPI } from "../config";
import { toQueryParams } from "../utils";



export interface BlanksResponse {
    data: {
        results: Product[];
        metadata: Metadata;
    };
}

const getBlanks = async (params?: {
    p?: number;
    l?: number;
    q?: string;
    business?: string;
    category?: string;
    status?: string;
}): Promise<BlanksResponse> => {
    const res = await fetchAPI({
        url: `/api/v1/blanks${toQueryParams(params || {})}`,
    });
    if (res?.error) {
        return {
            data: {
                results: [],
                metadata: {
                    totalCount: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                },
            },
        };
    }
    return res;
};

export default getBlanks;
