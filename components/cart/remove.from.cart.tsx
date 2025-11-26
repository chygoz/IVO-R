// import React from "react";
// import { Button } from "../ui/button";
// import Image from "next/image";
// import { useCart } from "@/contexts/cart/cart.context";
// import { Item } from "@/contexts/cart/cart.utils";
// import removeFromCart from "@/actions/cart/remove-from-cart";
// import { auth } from "@/auth";
// import { FaTrash } from "react-icons/fa";

// type RemoveFromCartProps = {
//   item: Item;
//   businessId?: string
// };
// function RemoveFromCart({ item, businessId }: RemoveFromCartProps) {
//   const { clearItem } = useCart();

//   const handleRemove = async () => {

//     try {
//       clearItem(item.id)

//       await removeFromCart(businessId!, item.id)
//     } catch (error) {
//       console.error("Something went wrong")
//     }
//   }

//   return (
//     <Button
//       onClick={handleRemove}
//       className="text-xl bg-transparent text-black hover:bg-gray-200"
//     >
//       <div className="flex flex-row w-full sm:gap-4 items-center justify-center">
//         <div className="relative w-5 h-5">
//           <FaTrash color="red" />
//         </div>
//         <p className="hidden sm:block">Remove</p>
//       </div>
//     </Button>
//   );
// }

// export default RemoveFromCart;
