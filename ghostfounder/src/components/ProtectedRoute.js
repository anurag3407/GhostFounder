"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { IconLoader2, IconGhost2 } from "@tabler/icons-react";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <IconGhost2 className="w-16 h-16 text-[#00d4ff] animate-pulse" />
          <div className="flex items-center gap-2 text-[#9ca3af]">
            <IconLoader2 className="w-5 h-5 animate-spin" />
            <span>Loading...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return currentUser ? children : null;
}
