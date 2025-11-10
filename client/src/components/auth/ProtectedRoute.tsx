// src/components/auth/ProtectedRoute.tsx
import React from "react";
import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  component: React.ComponentType;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  component: Component,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  // 🧱 Not logged in
  if (!user) {
    return <Redirect to={`/auth?redirect=${location}`} />;
  }

  // 🔐 Role not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Redirect to="/" />;
  }

  return <Component />;
}
