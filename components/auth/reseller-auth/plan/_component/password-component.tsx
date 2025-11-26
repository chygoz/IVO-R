"use client";

import { useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface PasswordInputProps {
  field: any;
}

export function PasswordInput({ field }: PasswordInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            type={passwordVisible ? "text" : "password"}
            placeholder="••••••••"
            {...field}
          />
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <HiEyeOff /> : <HiEye />}
          </span>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
