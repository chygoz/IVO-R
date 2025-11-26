// import { Product } from "@/actions/types";
// import { motion, AnimatePresence } from "framer-motion";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import ProductProvider from "@/providers/product.provider";
// import { useState } from "react";
// import { ScrollArea } from "./scroll-area";
// import ProductCard from "../store/_components/products/product_card";
// import { useCart } from "@/contexts/cart/cart.context";

// type ProductDetailModalProps = {
//   product: Product;
//   businessId: string
// };

// function ProductDetailModal({ product, businessId }: ProductDetailModalProps) {
//   const [open, setOpen] = useState(false);
//   const { findProductVariantWithCartItem } = useCart();

//   const response = findProductVariantWithCartItem(product);
//   const inCart = !!response?.variant;
//   const TEXT = inCart ? "ADDED" : "ADD TO CART";
//   return (
//     <ProductProvider>
//       <button
//         onClick={() => setOpen(true)}
//         className={`p-4 mt-8 w-full h-full bg-primary-500 uppercase text-white justify-center items-center border transition-all duration-300 ease-in-out`}
//       >
//         {TEXT}
//       </button>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-[905px]">
//           <DialogHeader className="hidden">
//             <DialogTitle>Product Detail</DialogTitle>
//             <DialogDescription></DialogDescription>
//           </DialogHeader>
//           <ScrollArea className="max-h-[550px] px-4">
//             <ProductCard
//             businessId={businessId}
//               className="gap-[10px]"
//               classNameImage="max-w-[400px]"
//               product={product}
//             />
//           </ScrollArea>
//         </DialogContent>
//       </Dialog>
//     </ProductProvider>
//   );
// }

// export default ProductDetailModal;
