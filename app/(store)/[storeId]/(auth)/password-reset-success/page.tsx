"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PasswordResetSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow text-center"
      >
        <h1 className="text-2xl font-bold mb-2">Password Reset Successful</h1>
        <p className="text-gray-600 mb-8">
          You can now log in with your new password.
        </p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </motion.div>
    </div>
  );
}
