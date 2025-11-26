import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IOrder } from "@/types/orders";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type CartItemOrderProps = {
  order: IOrder;
};

function CartItemOrder({ order }: CartItemOrderProps) {
  return (
    <Card className="md:col-span-5">
      <div className="grid sm:grid-cols-5 bg-[#F8F8F8] p-5">
        <div className="font-bold sm:col-span-3">Product Information</div>
        <div className="hidden sm:block">Qty</div>
        <div className="hidden sm:block">Price</div>
      </div>
      <ul className="p-5 flex flex-col gap-16">
        {order.items.slice(0, 2).map((item, index) => (
          <div key={index.toString()} className="grid sm:grid-cols-5">
            <div className="sm:col-span-3">
              <div className="flex items-start gap-4">
                <Image
                  src={item.variant.gallery[0]?.url}
                  width={140}
                  height={140}
                  alt=""
                  className="size-[140px] object-cover object-top"
                />
                <div className="flex flex-col">
                  <div className="font-bold capitalize">
                    {/* {item.product.name} */}
                  </div>
                  <div className="block sm:hidden">X{item.quantity}</div>
                  <div className="block sm:hidden">
                    {/* {item.price && <PriceDisplay price={item.price} />} */}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">X{item.quantity}</div>
            <div className="hidden sm:block">
              {/* {item.price && <PriceDisplay price={item.price} />} */}
            </div>
          </div>
        ))}
      </ul>
    </Card>
  );
}

export default CartItemOrder;
