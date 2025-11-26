import Button from '@/components/ui/custom_components/custom-button'
import React from 'react'
import SubscribeSlip from './_component/subscribe-slip'
import { Separator } from '@/components/ui/separator'

const ProceedToPayComponent = () => {
    return (
        <section className="px-0 py-6 w-full space-y-8 flex flex-col justify-center items-center text-center xl:px-32 xl:gap-6">

            <div className="w-full md:w-[580px] h-auto rounded-xl bg-white px-2 py-4 md:p-8 flex flex-col justify-between items-center space-y-6">

                <div className="w-full text-start rounded-xl bg-white p-8 space-y-4">
                    <p className="text-sm text-black">Subscribe to IVO Basic Plan Subscription</p>
                    {/* <p className="text-sm text-gray-600">test</p> */}
                    <div className="flex items-end space-x-2">
                        <p className="text-5xl font-bold">N2,200,000</p>
                        <span>/yr</span>
                    </div>

                    <div className='my-20 space-y-6'>
                        <SubscribeSlip title={'IVO Basic Subscription'} amount={0} />
                        <Separator orientation='horizontal' />
                        <SubscribeSlip title={'Subtotal'} amount={0} />
                        <SubscribeSlip title={'Tax / VAT'} amount={0} />
                        <Separator orientation='horizontal' />
                        <SubscribeSlip title={'Total amount'} amount={0} />
                    </div>

                    <Button
                    navigateTo='/secure-account'
                        type="submit"
                        title="Proceed To Payment"
                        variant="w-full h-[70px] rounded-xl bg-green-950 text-white flex items-center justify-center"
                    />

                    <Button type={'button'} title={'Log Out'}
                        variant="w-full text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                        bgColor="bg-transparent text-red-500"
                    />
                </div>
            </div>
        </section>
    )
}

export default ProceedToPayComponent