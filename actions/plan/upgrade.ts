import { fetchAPI } from "../config";



const upgradePlans = async (id: string) => {
    try {
        const response = await fetchAPI({ url: `api/v1/subscriptions/${id}/payments` })

        if (response.error) {
            console.error("Failed to fetch data", response.error)
            return null
        }

        return response.data;
    } catch (error) {
        console.error("Unexpected error while fetching upgrade")
    }

}
export default upgradePlans;



