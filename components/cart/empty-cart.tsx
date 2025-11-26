import React, { FC } from "react";
import ContinueShopping from "./ContinueShopping";

type EmptyCartProps = {
  width?: number;
  height?: number;
  className?: string;
};

const EmptyCart: FC<EmptyCartProps> = () => {
  return (
    <>
      <div>Your bag is empty</div>
      <ContinueShopping />
    </>
  );
};

export default EmptyCart;
