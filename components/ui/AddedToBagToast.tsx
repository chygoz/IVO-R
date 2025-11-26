// "use client";
// import { Item } from "@/contexts/cart/cart.utils";
// import { findView } from "@/utils/product.utils";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import { toast } from "sonner";
// import { useCart } from "@/contexts/cart/cart.context";
// import { formatMoney } from "@/utils/money";
// import PriceDisplay from "./price";

// type AddToCardToastProps = {
//   item: Item;
//   price: string;
// };

// function AddedToBagToast({ item, price }: AddToCardToastProps) {
//   const { totalItems } = useCart();
//   return (
//     <div className="w-80 flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <h4 className="uppercase font-bold text-xl">Added To Bag</h4>
//       </div>
//       <div className="grid grid-cols-2 gap-3 p-2 w-full h-40">
//         <div className="bg-gray-200 relative">
//           <Image
//             src={findView(item.product.variants[0], "front")}
//             alt={item.product.name}
//             fill
//             className="object-cover w-full h-full"
//             priority
//             quality={100}
//           />
//         </div>
//         <div className="flex flex-col gap-3">
//           <div className="text-xl font-semibold text-wrap capitalize">
//             {item.product.name}
//           </div>
//           {item.price && <PriceDisplay price={item.price} />}
//         </div>
//       </div>
//       <div className="flex items-center gap-2 w-full">
//         <Link
//           onClick={() => toast.dismiss()}
//           className="p-4 uppercase outline outline-1 text-center  rounded-none w-full"
//           href="/cart"
//         >
//           View Bag ({totalItems})
//         </Link>
//         <Link
//           onClick={() => toast.dismiss()}
//           className="p-4 uppercase bg-black text-center rounded-none text-white w-full"
//           href="/checkout"
//         >
//           Checkout
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default AddedToBagToast;
