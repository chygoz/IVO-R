import React from "react";
import { Button } from "./button";
import { Input } from "./input";

type QuantitySelectorProps = {
  onChange: (value: number) => void;
  value: number;
  max?: number;
};

function QuantitySelector({ value, onChange, max }: QuantitySelectorProps) {
  function handleIncrement() {
    if (max && value + 1 > max) {
      return;
    }
    onChange(value + 1);
  }
  function handleDecrement() {
    if (value - 1 >= 0) {
      onChange(value - 1);
    }
  }
  return (
    <div className="flex items-center gap-4 bg-input-bg max-w-[400px] w-full h-[64px] rounded-md justify-between">
      <Button
        type="button"
        className="bg-[#EFF1F4] text-[#2D343F] hover:bg-primary hover:text-white flex flex-col items-center justify-center"
        onClick={handleDecrement}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3.33203 8H12.6654"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      <Input
        min={0}
        max={max ? max : 100}
        className="no-arrows h-11 min-w-[60px] text-2xl font-medium  hover:outline-none focus-visible:shadow-none ring-0 text-center"
        type="number"
        value={value.toString()}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (max && val > max) {
            return;
          }
          onChange(val);
        }}
      />
      <Button
        type="button"
        className="bg-[#EFF1F4] text-[#2D343F] hover:bg-primary hover:text-white flex flex-col items-center justify-center"
        onClick={handleIncrement}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </Button>
    </div>
  );
}

export default QuantitySelector;
