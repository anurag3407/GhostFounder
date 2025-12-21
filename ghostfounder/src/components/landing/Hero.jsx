"use client";

import { motion } from "framer-motion";
import { SparklesCore } from "@/components/ui/sparkles";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { MovingBorder } from "@/components/ui/moving-border";
import Link from "next/link";
import {
  IconGhost2,
  IconCode,
  IconDatabase,
  IconCurrencyDollar,
  IconPresentation,
  IconSpy,
  IconNews,
  IconFlame,
} from "@tabler/icons-react";

export const Hero = () => {
  const agentWords = [
    "Code Guardian",
    "Data Specter",
    "Treasury Wraith",
    "Pitch Poltergeist",
    "Shadow Scout",
    "News Banshee",
    "Investor Ghoul",
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.5}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#00d4ff"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Ghost Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <IconGhost2 className="w-20 h-20 mx-auto text-[#00d4ff] animate-float" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="gradient-text">Ghost</span>
          <span className="text-white">Founder</span>
        </motion.h1>

        {/* Subtitle with TextGenerateEffect */}
        <div className="mb-8">
          <TextGenerateEffect
            words="Your AI-Powered Phantom Team for Startup Success"
            className="text-xl md:text-2xl text-[#9ca3af]"
          />
        </div>

        {/* Dynamic Agent Names */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-lg md:text-xl mb-12 text-[#9ca3af]"
        >
          Meet your{" "}
          <span className="text-[#ffd700] font-semibold">
            <FlipWords words={agentWords} />
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/register">
            <MovingBorder
              duration={3000}
              className="px-8 py-4 text-lg font-semibold text-white hover:text-[#00d4ff] transition-colors"
            >
              Get Started Free
            </MovingBorder>
          </Link>
          <Link
            href="#features"
            className="ghost-button px-8 py-4 text-lg font-semibold"
          >
            Explore Agents
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">8</div>
            <div className="text-sm text-[#9ca3af]">AI Agents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text-accent">24/7</div>
            <div className="text-sm text-[#9ca3af]">Autonomous</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">100%</div>
            <div className="text-sm text-[#9ca3af]">Automated</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[#00d4ff]/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-[#00d4ff] rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
