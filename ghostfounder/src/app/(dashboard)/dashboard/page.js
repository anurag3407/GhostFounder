"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import {
  IconCode,
  IconDatabase,
  IconCurrencyDollar,
  IconLink,
  IconPresentation,
  IconSpy,
  IconNews,
  IconFlame,
  IconArrowRight,
  IconBrandGithub,
  IconPlug,
} from "@tabler/icons-react";
import Link from "next/link";

const agents = [
  {
    icon: IconCode,
    title: "Phantom Code Guardian",
    description: "Autonomous code reviewer for your GitHub PRs",
    href: "/agents/code-guardian",
    color: "#00d4ff",
    status: "Connect GitHub to activate",
  },
  {
    icon: IconDatabase,
    title: "Data Specter",
    description: "Natural language database queries",
    href: "/agents/data-specter",
    color: "#00ff88",
    status: "Ready",
  },
  {
    icon: IconCurrencyDollar,
    title: "Treasury Wraith",
    description: "Financial reports and analysis",
    href: "/agents/treasury-wraith",
    color: "#ffd700",
    status: "Ready",
  },
  {
    icon: IconLink,
    title: "Equity Phantom",
    description: "Blockchain equity distribution",
    href: "/agents/equity-phantom",
    color: "#00d4ff",
    status: "Ready",
  },
  {
    icon: IconPresentation,
    title: "Pitch Poltergeist",
    description: "AI-powered pitch deck generator",
    href: "/agents/pitch-poltergeist",
    color: "#ff6b35",
    status: "Coming Soon",
  },
  {
    icon: IconSpy,
    title: "Shadow Scout",
    description: "Competitive intelligence agent",
    href: "/agents/shadow-scout",
    color: "#9ca3af",
    status: "Coming Soon",
  },
  {
    icon: IconNews,
    title: "News Banshee",
    description: "Real-time industry news",
    href: "/agents/news-banshee",
    color: "#00d4ff",
    status: "Coming Soon",
  },
  {
    icon: IconFlame,
    title: "Investor Ghoul",
    description: "VC Roast Mode - honest feedback",
    href: "/agents/investor-ghoul",
    color: "#ff3366",
    status: "Coming Soon",
  },
];

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {currentUser?.displayName?.split(" ")[0] || "Founder"}! 👻
        </h1>
        <p className="text-[#9ca3af]">
          Your phantom team is ready to help you build something amazing.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <CardSpotlight className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IconBrandGithub className="w-6 h-6 text-white" />
                <h3 className="text-lg font-semibold text-white">Connect GitHub</h3>
              </div>
              <p className="text-[#9ca3af] text-sm mb-4">
                Connect your GitHub account to enable the Phantom Code Guardian.
              </p>
              <button className="ghost-button-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <IconPlug className="w-4 h-4" />
                Connect Now
              </button>
            </div>
          </div>
        </CardSpotlight>

        <CardSpotlight className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IconPresentation className="w-6 h-6 text-[#ff6b35]" />
                <h3 className="text-lg font-semibold text-white">Create Pitch Deck</h3>
              </div>
              <p className="text-[#9ca3af] text-sm mb-4">
                Generate a compelling pitch deck for your startup in minutes.
              </p>
              <Link
                href="/dashboard/pitch-poltergeist"
                className="ghost-button px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2"
              >
                Get Started
                <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </CardSpotlight>
      </motion.div>

      {/* Agents Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Your Phantom Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={agent.href}>
                <CardSpotlight
                  className="p-4 h-full hover:border-white/15 transition-colors"
                  color={`${agent.color}20`}
                >
                  <div className="flex flex-col h-full">
                    <agent.icon
                      className="w-8 h-8 mb-3"
                      style={{ color: agent.color }}
                    />
                    <h3 className="text-white font-semibold mb-1">{agent.title}</h3>
                    <p className="text-[#9ca3af] text-sm flex-1">{agent.description}</p>
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <span
                        className={`text-xs font-medium ${
                          agent.status === "Ready"
                            ? "text-[#00ff88]"
                            : agent.status === "Coming Soon"
                            ? "text-[#9ca3af]"
                            : "text-[#ffd700]"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>
                  </div>
                </CardSpotlight>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Usage Stats Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <CardSpotlight className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Token Usage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-[#9ca3af] text-sm">Today</p>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-[#9ca3af] text-xs">tokens</p>
            </div>
            <div>
              <p className="text-[#9ca3af] text-sm">This Month</p>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-[#9ca3af] text-xs">tokens</p>
            </div>
            <div>
              <p className="text-[#9ca3af] text-sm">Estimated Cost</p>
              <p className="text-2xl font-bold text-[#00ff88]">$0.00</p>
              <p className="text-[#9ca3af] text-xs">USD</p>
            </div>
          </div>
        </CardSpotlight>
      </motion.div>
    </div>
  );
}
