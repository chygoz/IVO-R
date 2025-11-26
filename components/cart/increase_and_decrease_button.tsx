// import { useCart } from "@/contexts/cart/cart.context";
// import { Button } from "../ui/button";

// type Props = {
//   id: string | number;
//   quantity: number | undefined;
// };

// function IncreaseAndDecreaseButton({ id, quantity = 1 }: Props) {
//   const { increaseItemQuantity, decreaseItemQuantity } = useCart();

//   return (
//     <div className="flex w-full h-full text-center rounded-md border border-zinc-300 flex-row justify-between items-center ">
//       <Button
//         onClick={() => decreaseItemQuantity(id)}
//         variant={"ghost"}
//         className="bg-transparent text-xl text-primary-500 hover:bg-gray-200"
//       >
//         -
//       </Button>

//       <p className="text-xl md:text-20">{quantity}</p>

//       <Button
//         onClick={() => increaseItemQuantity(id)}
//         variant={"ghost"}
//         className="bg-transparent text-xl text-primary-500 hover:bg-gray-200"
//       >
//         +
//       </Button>
//     </div>
//   );
// }

// export default IncreaseAndDecreaseButton;
