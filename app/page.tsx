"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/modules/auth";

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login page immediately
    router.push(authRoutes.login);
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Redirecting to login...</p>
      </div>
    </div>
  );
}










