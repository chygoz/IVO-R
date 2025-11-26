"use client";
import { useAuth } from "@/contexts/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <AuthGuard requiredRole="customer">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>

        {/* Account content here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
