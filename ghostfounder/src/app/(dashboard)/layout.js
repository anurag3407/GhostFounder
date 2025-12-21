"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconGhost2,
  IconLayoutDashboard,
  IconCode,
  IconDatabase,
  IconCurrencyDollar,
  IconLink,
  IconPresentation,
  IconSpy,
  IconNews,
  IconFlame,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconX,
  IconBrandGithub,
} from "@tabler/icons-react";

const sidebarItems = [
  { icon: IconLayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: IconCode, label: "Code Guardian", href: "/agents/code-guardian" },
  { icon: IconDatabase, label: "Data Specter", href: "/agents/data-specter" },
  { icon: IconCurrencyDollar, label: "Treasury Wraith", href: "/agents/treasury-wraith" },
  { icon: IconLink, label: "Equity Phantom", href: "/agents/equity-phantom" },
  { icon: IconPresentation, label: "Pitch Poltergeist", href: "/agents/pitch-poltergeist" },
  { icon: IconSpy, label: "Shadow Scout", href: "/agents/shadow-scout" },
  { icon: IconNews, label: "News Banshee", href: "/agents/news-banshee" },
  { icon: IconFlame, label: "Investor Ghoul", href: "/agents/investor-ghoul" },
];

const bottomItems = [
  { icon: IconBrandGithub, label: "GitHub", href: "/dashboard/github" },
  { icon: IconSettings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0f] flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0f] border-r border-white/5 flex flex-col transform transition-transform lg:transform-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo */}
          <div className="p-4 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <IconGhost2 className="w-8 h-8 text-[#00d4ff]" />
              <span className="text-lg font-bold">
                <span className="gradient-text">Ghost</span>
                <span className="text-white">Founder</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20"
                      : "text-[#9ca3af] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/5 space-y-1">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#00d4ff]/10 text-[#00d4ff]"
                      : "text-[#9ca3af] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#ff3366] hover:bg-[#ff3366]/10 transition-all w-full"
            >
              <IconLogout className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0099cc] flex items-center justify-center text-white font-semibold">
                {currentUser?.displayName?.[0] || currentUser?.email?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser?.displayName || "User"}
                </p>
                <p className="text-xs text-[#9ca3af] truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 p-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[#9ca3af] hover:text-white transition-colors"
            >
              <IconMenu2 className="w-6 h-6" />
            </button>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
