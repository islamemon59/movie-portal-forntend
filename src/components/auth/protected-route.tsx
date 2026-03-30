"use client";

import { ReactNode } from "react";

import Link from "next/link";
import { useAccess } from "@/hooks/use-role";
import { buttonVariants } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "USER" | "ADMIN";
  fallback?: ReactNode;
}

/**
 * Component to protect routes based on user role
 */
export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAccess();

  // Check authentication
  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You need to sign in to access this page.
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex gap-3">
            <Link href="/auth/login" className={buttonVariants({ variant: "outline" })}>
              Sign In
            </Link>
            <Link href="/auth/signup" className={buttonVariants()}>
              Create Account
            </Link>
          </div>
        </div>
      )
    );
  }

  // Check role if required
  if (requiredRole && !isAdmin && requiredRole === "ADMIN") {
    return (
      fallback || (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don&apos;t have permission to access this page. Only admins can access this area.
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Back to Home
            </Link>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

interface RoleBasedProps {
  children: ReactNode;
  role: "USER" | "ADMIN";
}

/**
 * Component to conditionally render content based on user role
 */
export function RoleBasedContent({ children, role }: RoleBasedProps) {
  const { user } = useAccess();

  if (user?.role !== role) {
    return null;
  }

  return <>{children}</>;
}

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to render only for admin users
 */
export function AdminOnly({ children, fallback }: AdminOnlyProps) {
  const { isAdmin } = useAccess();

  if (!isAdmin) {
    return fallback || null;
  }

  return <>{children}</>;
}

interface UserOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to render only for regular users
 */
export function UserOnly({ children, fallback }: UserOnlyProps) {
  const { isAdmin } = useAccess();

  if (isAdmin) {
    return fallback || null;
  }

  return <>{children}</>;
}
