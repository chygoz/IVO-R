import { fetchAPI } from "../config"

export const getUserShippingAddress = async () => {

    try {
        const address = await fetchAPI({ url: '/api/v1/shippings/address/user' })
        console.log('user shipping address:', address)
        return address
    } catch (error) {
        console.log("Error get user address")
    }
}