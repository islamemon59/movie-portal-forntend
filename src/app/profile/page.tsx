"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-linear-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">
            Please sign in to view your profile
          </p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-linear-to-br from-background to-muted">
      <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold sm:text-4xl">Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-lg border bg-card p-8 space-y-6">
          {/* User Avatar */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-linear-to-br from-primary to-primary/50 flex items-center justify-center text-white text-2xl font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4 border-b pb-6">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <p className="text-lg font-medium">{user?.name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="text-lg font-medium">{user?.email || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Role</label>
              <p className="text-lg font-medium capitalize">{user?.role?.toLowerCase() || "User"}</p>
            </div>
            {user?.emailVerified && (
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-green-600">Email verified</span>
              </div>
            )}
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-semibold">0</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-semibold">0</p>
              <p className="text-xs text-muted-foreground">Watchlist Items</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Link href="/watchlist" className="block">
              <Button className="w-full" variant="outline">
                View Watchlist
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full"
              variant="destructive"
            >
              {isLoading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Account created on{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
