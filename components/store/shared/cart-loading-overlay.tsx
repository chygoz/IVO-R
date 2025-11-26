"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/providers/cart-provider";
import { useStore } from "@/lib/store-context";

export function CartLoadingOverlay() {
  const { actionLoading, error } = useCart(); // Only show for actionLoading, not regular loading
  const { store } = useStore();

  return (
    <AnimatePresence>
      {(actionLoading || error) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"
        >
          {actionLoading && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-3"
            >
              <div
                className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-current"
                style={{ borderTopColor: store.colors.primary }}
              ></div>
              <span className="font-medium">Updating cart...</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm">!</span>
                </div>
                <h3 className="font-bold text-red-600">Cart Error</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 rounded-md text-sm font-medium"
                style={{
                  backgroundColor: store.colors.primary,
                  color: store.colors.background,
                }}
              >
                Retry
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
