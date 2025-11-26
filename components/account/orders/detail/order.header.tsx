import { IOrder } from "@/types/orders";
import dayjs from "dayjs";
import React from "react";

const steps = ["Order placed", "Inprogress", "Shipped", "Delivered"];

const OrderDetailsCard = ({ order }: { order: IOrder }) => {
  const getStepStatus = (step: string) => {
    const progressIndex = order.orderProgress.findIndex(
      (p) => p.status.toLowerCase() === step.toLowerCase()
    );
    if (progressIndex === -1) return "pending";
    return "completed";
  };

  return (
    <div className="w-full bg-[#F8F8F8] rounded-lg shadow-sm">
      <div className="flex flex-col bg-gray-50 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-gray-900">Order Details</h4>
          <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50">
            Contact Us
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
          <span>
            Order Date: {dayjs(order.orderDate).format("YYYY-MM-DD HH:mm")}
          </span>
          <span>
            Order No: <span className="uppercase">{order.orderId}</span>
          </span>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200" />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step);
              return (
                <div key={step} className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${
                      status === "completed"
                        ? "bg-primary-500"
                        : "bg-white border-2 border-gray-300"
                    }
                    relative z-10
                  `}
                  >
                    {status === "completed" && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Label */}
                  <span className="mt-2 text-sm text-gray-600">{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Message */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Your order has been successfully verified.
          <br />
          <span className="text-gray-500">
            {dayjs(order.orderDate).format("YYYY-MM-DD HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsCard;
