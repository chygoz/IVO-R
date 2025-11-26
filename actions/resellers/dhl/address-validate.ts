import { fetchAPI } from "@/actions/config";
import { URLSearchParams } from "url";

type ValidateAddressParams = {
    countryCode: string;
    postalCode: string;
    city: string;
    addressLine: string;
};

export async function validateDhlAddress(params: ValidateAddressParams) {
    try {
        // const query = new URLSearchParams(params as any).toString()

        const { data } = await fetchAPI({ url: `/api/v1/shippings/address/validate` })

        return data

    } catch (error: any) {
        throw new Error(error?.message || "Address validation failed");

    }
}