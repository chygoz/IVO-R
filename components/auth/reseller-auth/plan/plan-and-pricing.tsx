import React from 'react'
import PlanCard from './plan-card'
import { THEPLANPRICE } from '@/lib/reseller'
import Button from '@/components/ui/custom_components/custom-button'

const PlanAndPricingComponent = () => {
  return (
    <section className="px-0 py-6 w-full space-y-6 flex flex-col items-center text-center xl:px-32 xl:gap-6">

      <h2 className="text-3xl  md:text-5xl font-bold">
        Plans and Pricing
      </h2>
      <p className="text-gray-600 px-2 text-md mt-6 xl:max-w-[520px] mb-12">
        Explore our Basic and Pro Reseller plans. Choose your plan and start selling from your customized storefront
      </p>

      <div className=" px-4 md:px-12 gap-10 flex flex-col md:flex-row  justify-center items-center">
        {THEPLANPRICE.map((content, index) => (
          <PlanCard
            key={index}
            plan={content.plan}
            subplan={content.subplan}
            price={content.price}
            // renewal={content.renewal}
            benefit={content.benefit}
          />
        ))}
      </div>

      <Button type={'button'} title={'Log Out'}
        variant="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
        bgColor="bg-transparent text-red-500"
      />
    </section>)
}

export default PlanAndPricingComponent