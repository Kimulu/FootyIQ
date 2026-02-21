"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/");
    }

    if (!isLoading && token && user && allowedRoles) {
      if (!allowedRoles.includes(user.role)) {
        router.push(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
      }
    }
  }, [isLoading, token, user, router, allowedRoles]);

  // Show spinner while auth is resolving
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  // Keep dark background while redirect is in progress — never flash white
  if (!user) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  return <>{children}</>;
}
