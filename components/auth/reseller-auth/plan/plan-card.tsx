import Button from '@/components/ui/custom_components/custom-button';
import Image from 'next/image';
import React from 'react';
import correct from '@/app/assets/correct.svg'
import { formatMoney } from '@/utils/money';

type PlanCardProps = {
    plan: string;
    subplan: string;
    price: string;
    benefit: string[];
    currency?: string;
    onSelect?: () => void

    // renewal: string;
};

const PlanCard = ({ plan, subplan, price, benefit, currency, onSelect }: PlanCardProps) => {
    return (
        <div className="w-full md:w-[580px] h-full rounded-xl bg-gray-100 px-2 py-4 md:p-8 flex flex-col justify-between items-start space-y-6">
            {/* Plan Info */}
            <div className="w-full text-start capitalize rounded-xl bg-white p-8 space-y-4">
                <p className="text-xl font-semibold">{plan}</p>
                <p className="text-sm text-gray-600 capitalize">Best for {subplan}</p>
                <div className="flex items-end space-x-2">
                    <p className="text-5xl font-bold">{currency} {formatMoney((Number(price)))}</p>
                    <span>/yr</span>
                </div>
                {/* <p className="text-sm text-gray-600">{renewal}</p> */}
                <Button
                    type="submit"
                    title="Get Started"
                    variant="w-full h-[70px] rounded-xl bg-green-950 text-white flex items-center justify-center"
                />
            </div>



            {/* Benefit List */}
            <div className="w-full  space-y-3">
                {benefit.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-shrink-0 items-center space-x-4 text-start text-md font-medium"
                    >
                        <div className="relative w-[24px] h-[24px]">
                            <Image
                                src={correct}
                                alt="Tick icon"
                                fill
                                objectFit="contain"
                                className="rounded-full"
                            />
                        </div>
                        <p className="text-black  capitalize w-full text-balance">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default PlanCard;