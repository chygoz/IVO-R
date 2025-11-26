import { fetchAPI } from "../config";


const renewSub = async (): Promise<{ data: any }> => {

    try {
        const res = await fetchAPI({ url: `/api/v1/subscriptions/renew` })

        if (res.error) {
            return { data: null }
        }
        console.log('renew data', res)
        return res

    } catch (error) {
        console.error('renew error', error)
        return { data: null }
    }
}

export default renewSub;