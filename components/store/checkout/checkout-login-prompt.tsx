"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/contexts/auth-context";
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCheckout } from "@/hooks/use-checkout";

export function CheckoutLoginPrompt() {
  const { store } = useStore();
  const { updateState } = useCheckout()
  const { colors } = store;
  const { authenticateUser, isLoading, setIsLoading, signup } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [error, setError] = useState("");

  const themeStyles = {
    primary: { backgroundColor: colors.primary },
    primaryText: { color: colors.primary },
    background: { backgroundColor: colors.background },
    backgroundText: { color: colors.background },
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return false;
    }

    if (!isLogin) {
      if (!formData.firstName || !formData.lastName) {
        setError("First name and last name are required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");

    try {
      if (isLogin) {
        const result = await authenticateUser(
          formData.email,
          formData.password,
          store.id
        );
        console.log(result, "result");

        if (!result.success) {
          setError(result.error || "Login failed");
          return;
        }

        // If no redirect, just refresh the page (should not normally happen)

        updateState({ error: null })
        // If successful, the useAuth hook will handle the redirect
      } else {
        setIsLoading(true);
        const result = await signup({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        })
        if (!result.success) {
          setError(result.error || "Login failed");
          return;
        }
        updateState({ error: null })
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestCheckout = () => {
    router.push("/checkout/guest");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={themeStyles.background}
    >
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center space-y-6"
        >
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6"
              style={themeStyles.primary}
            >
              <ShoppingBag
                className="w-8 h-8"
                style={themeStyles.backgroundText}
              />
            </motion.div>

            <h1
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={themeStyles.primaryText}
            >
              Complete Your Purchase
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Sign in to your account to complete your
              order from {store.name}.
            </p>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={themeStyles.primary}
                />
                <span>Secure checkout process</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={themeStyles.primary}
                />
                <span>Multiple payment options</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={themeStyles.primary}
                />
                <span>Fast and reliable shipping</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Auth Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-2xl">
            <CardHeader className="space-y-4">
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isLogin
                    ? "text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                  style={isLogin ? themeStyles.primary : {}}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isLogin
                    ? "text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                  style={!isLogin ? themeStyles.primary : {}}
                >
                  Create Account
                </button>
              </div>

              <CardTitle className="text-center">
                {isLogin ? "Welcome back!" : "Create your account"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="Enter first name"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Enter last name"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="lastName">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Enter Phone Number"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>
                )}

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your email"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        placeholder="Confirm your password"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 font-semibold"
                  style={themeStyles.primary}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="space-y-4">
                <Separator className="my-6" />

                {isLogin && (
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm hover:underline"
                      style={themeStyles.primaryText}
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
