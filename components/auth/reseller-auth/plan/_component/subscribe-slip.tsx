import React from 'react'


type SubscribeSlipProps = {
    title: string,
    amount: number
}
const SubscribeSlip = ({ title, amount}: SubscribeSlipProps) => {
    return (
        <div className='flex justify-between items-center font-medium'>
            <p className="text-sm text-black">{title}</p>
            <p className="text-sm text-black">N{amount}</p>

        </div>
    )
}

export default SubscribeSlip