// "use client";
// import React from "react";
// import Container from "../ui/container";
// import CartItem from "./item";
// import CheckoutInfo from "./checkoutInfo";
// import ContinueShopping from "./ContinueShopping";
// import { useCart } from "@/contexts/cart/cart.context";

// type CartComponentProps = {
//   businessId: string
// }
// const CartComponent = ({ businessId }: CartComponentProps) => {
//   const { items } = useCart();


//   return (
//     <Container className="w-full h-full items-start justify-center mt-12 lg:mt-14 xl:mt-16 px-4 md:px-6 lg:px-6 xl:px-16 pb-9 md:pb-14 lg:pb-16 ">
//       {/* The header always displays */}
//       <h2 className="w-full h-full font-bold text-xl md:text-4xl text-center mb-12 text-gray-600 mt-32">
//         SHOPPING CART
//       </h2>

//       <div className="w-full md:w-full h-full font-light">
//         {items.length === 0 ? (
//           <div className=" items-center justify-center flex flex-col">
//             <p className="text-center items-center justify-center text-gray-600">
//               Your cart is empty.
//             </p>
//             <ContinueShopping />
//           </div>
//         ) : (
//           <div className="flex w-full  flex-col md:flex md:flex-row gap-4 justify-start items-start">
//             <div className="flex grow flex-col gap-3 w-full">
//               {items.map((item) => (
//                 <CartItem key={item.id} businessId={businessId} item={item} />
//               ))}
//             </div>
//             <div className="w-full max-w-[400px] shrink-0">
//               <CheckoutInfo businessId={businessId} />
//             </div>
//           </div>
//         )}
//       </div>
//     </Container>
//   );
// };

// export default CartComponent;
