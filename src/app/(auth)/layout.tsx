"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth"; // adjust path if needed

const Layout = ({ children }: { children: ReactNode }) => {
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && session) {
      router.push("/");
    }
  }, [session, hydrated, router]);

  // While checking hydration, don’t render anything
  if (!hydrated) return null;

  // If user already logged in, block auth pages
  if (session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="w-full max-w-md bg-background shadow-lg rounded-xl p-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;