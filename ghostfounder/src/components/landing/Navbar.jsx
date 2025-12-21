"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  IconGhost2,
  IconCode,
  IconDatabase,
  IconCurrencyDollar,
  IconLink,
  IconPresentation,
  IconSpy,
  IconNews,
  IconFlame,
} from "@tabler/icons-react";

const navItems = [
  { icon: IconCode, label: "Code Guardian", href: "#features" },
  { icon: IconDatabase, label: "Data Specter", href: "#features" },
  { icon: IconCurrencyDollar, label: "Treasury Wraith", href: "#features" },
  { icon: IconLink, label: "Equity Phantom", href: "#features" },
  { icon: IconPresentation, label: "Pitch Poltergeist", href: "#features" },
  { icon: IconSpy, label: "Shadow Scout", href: "#features" },
  { icon: IconNews, label: "News Banshee", href: "#features" },
  { icon: IconFlame, label: "Investor Ghoul", href: "#features" },
];

export const FloatingNav = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
        >
          <div className="ghost-card p-2 backdrop-blur-xl">
            <div className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="relative p-3 rounded-lg hover:bg-white/5 transition-colors group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <item.icon className="w-5 h-5 text-[#9ca3af] group-hover:text-[#00d4ff] transition-colors" />
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap"
                      >
                        <span className="bg-[#1a1a25] text-white text-sm px-3 py-1.5 rounded-lg border border-white/10">
                          {item.label}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <IconGhost2 className="w-8 h-8 text-[#00d4ff]" />
            <span className="text-xl font-bold">
              <span className="gradient-text">Ghost</span>
              <span className="text-white">Founder</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#agents"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              Agents
            </Link>
            <Link
              href="#pricing"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="ghost-button-primary px-4 py-2 rounded-lg text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
