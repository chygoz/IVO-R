import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import verifyCoupon from "@/actions/verify.coupon";
import { Button } from "./button";
import { Input } from "./input";
type CouponProps = {
  setDiscount: React.Dispatch<React.SetStateAction<number>>;
};
function Coupon({ setDiscount }: CouponProps) {
  const [couponCode, setCouponCode] = useState("");

  const mutation = useMutation({
    mutationFn: verifyCoupon,
    onSuccess: (data) => {
      setDiscount(data.data.discount);
    },
    onError: () => {
      setDiscount(0);
    },
  });

  return (
    <div>
      <div className="relative mt-4">
        <Input
          className="p-3 border text-xs focus:outline-primary-500 border-[#E9EAF0] rounded-none w-full"
          title="coupon"
          type="coupon"
          placeholder="Discount code or gift card"
          value={couponCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCouponCode(e.target.value)
          }
        />
        <div className="absolute right-0 inset-y-0 p-1">
          <Button
            disabled={mutation.isPending}
            onClick={() => {
              if (couponCode) {
                mutation.mutate(couponCode);
              }
            }}
            title="apply coupon"
            className="h-full p-3 rounded-none bg-[#20483F] text-xs"
          >
            {mutation.isPending ? "Applying" : "Apply"}
          </Button>
        </div>
      </div>
      {mutation.isError ? (
        <div className="text-red-500 text-sm">Invalid/expired coupon</div>
      ) : null}
      {mutation.isSuccess ? (
        <div className="text-teal-500 text-xs text-right">
          Coupon applied!!! {mutation?.data?.data?.discount || 0}% off
        </div>
      ) : null}
    </div>
  );
}

export default Coupon;
