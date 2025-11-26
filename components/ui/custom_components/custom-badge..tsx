// import React from 'react'
// type OrderStatus = "Processing" | "Cancelled" | "Shipped" | "Delivered";


// type StatusProps = {
//     status: string
// }
// const CustomBadge = ({status}: StatusProps) => {

//     // Status color mappings for badge and text
//     const statusStyles: Record<OrderStatus, { badge: string; text: string }> = {
//         Processing: { badge: "bg-yellow-500", text: "text-yellow-600" },
//         Cancelled: { badge: "bg-red-500", text: "text-red-600" },
//         Shipped: { badge: "bg-blue-500", text: "text-blue-600" },
//         Delivered: { badge: "bg-green-500", text: "text-green-600" },
//       };


//   return (
//     <div className="flex items-center space-x-3">
//               {/* Status Indicator (Colored Circle) */}
//               <div
//                 className={`w-3 h-3 rounded-full ${statusStyles[status]?.badge}`}
//                 aria-label={`${status} status indicator`}
//               />
      
//               {/* Status Text */}
//               <span
//                 className={`text-sm font-semibold capitalize ${statusStyles[status]?.text}`}
//               >
//                 {status}
//               </span>
//             </div>
//   )
// }

// export default CustomBadge