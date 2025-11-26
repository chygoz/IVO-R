import { fetchAPI } from "../config";
import { PlanData } from "./util";



const getPlans = async (): Promise<PlanData | null> => {
    try {
        const response = await fetchAPI({ url: "/api/v1/plans" });

        if (response.error || !response.data?.plans) {
            console.error("Failed to fetch plans:", response.error);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error("Unexpected error while fetching plans:", error);
        return null;
    }
};

export default getPlans;
