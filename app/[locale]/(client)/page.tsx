"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/modules/auth";

const ClientPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login page immediately
    router.push(authRoutes.login);
  }, [router]);

  // Show loading or nothing while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default ClientPage;
