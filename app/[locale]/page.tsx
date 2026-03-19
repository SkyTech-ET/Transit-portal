"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/modules/auth";
import { useLocale } from "next-intl";

export default function HomePage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Redirect to login page immediately
    router.push(authRoutes.login);
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-lg text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}
