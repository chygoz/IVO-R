"use client";

import { motion } from "framer-motion";
import { ResetPasswordForm } from "@/components/auth/forms/reset-password";

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <ResetPasswordForm />
      </motion.div>
    </div>
  );
}
