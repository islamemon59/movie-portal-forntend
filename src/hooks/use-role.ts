"use client";

import { useAuth } from "@/hooks";

export type UserRole = "USER" | "ADMIN";

/**
 * Hook to check if user has a specific role
 */
export const useRole = () => {
  const { user } = useAuth();
  
  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  const isAdmin = () => user?.role === "ADMIN";
  const isUser = () => user?.role === "USER";
  const canModerate = () => user?.role === "ADMIN";

  return {
    role: user?.role,
    hasRole,
    isAdmin,
    isUser,
    canModerate,
  };
};

/**
 * Hook to check access level
 */
export const useAccess = () => {
  const { user, isAuthenticated } = useAuth();

  return {
    isAuthenticated,
    isAdmin: user?.role === "ADMIN",
    isUser: user?.role === "USER",
    user,
  };
};

/**
 * Check if user can perform admin actions
 */
export const canAccessAdmin = (role?: UserRole): boolean => {
  return role === "ADMIN";
};

/**
 * Check if user can moderate content
 */
export const canModerate = (role?: UserRole): boolean => {
  return role === "ADMIN";
};

/**
 * Check if user can edit content
 */
export const canEdit = (role?: UserRole, userId?: string, contentUserId?: string): boolean => {
  if (role === "ADMIN") return true;
  if (userId && contentUserId && userId === contentUserId) return true;
  return false;
};

/**
 * Check if user can delete content
 */
export const canDelete = (role?: UserRole, userId?: string, contentUserId?: string): boolean => {
  if (role === "ADMIN") return true;
  if (userId && contentUserId && userId === contentUserId) return true;
  return false;
};
