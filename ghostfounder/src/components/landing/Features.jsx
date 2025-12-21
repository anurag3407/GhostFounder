"use client";

import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Meteors } from "@/components/ui/meteors";
import {
  IconCode,
  IconDatabase,
  IconCurrencyDollar,
  IconLink,
  IconPresentation,
  IconSpy,
  IconNews,
  IconFlame,
} from "@tabler/icons-react";

const agents = [
  {
    title: "Phantom Code Guardian",
    description:
      "Autonomous code reviewer that analyzes PRs, detects bugs, security issues, and sends detailed reports via email and WhatsApp.",
    icon: <IconCode className="h-6 w-6 text-[#00d4ff]" />,
    className: "md:col-span-2",
    header: (
      <div className="relative h-full min-h-[8rem] rounded-xl overflow-hidden bg-gradient-to-br from-[#00d4ff]/10 to-transparent">
        <Meteors number={10} />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconCode className="h-16 w-16 text-[#00d4ff]/30" />
        </div>
      </div>
    ),
  },
  {
    title: "Data Specter",
    description:
      "Natural language database queries with real-time responses and data visualization.",
    icon: <IconDatabase className="h-6 w-6 text-[#00ff88]" />,
    className: "md:col-span-1",
    header: (
      <div className="relative h-full min-h-[8rem] rounded-xl overflow-hidden bg-gradient-to-br from-[#00ff88]/10 to-transparent">
        <Meteors number={8} />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconDatabase className="h-16 w-16 text-[#00ff88]/30" />
        </div>
      </div>
    ),
  },
  {
    title: "Treasury Wraith",
    description:
      "CFO agent that generates financial reports and creates shareable Google Sheets.",
    icon: <IconCurrencyDollar className="h-6 w-6 text-[#ffd700]" />,
    className: "md:col-span-1",
    header: (
      <div className="relative h-full min-h-[8rem] rounded-xl overflow-hidden bg-gradient-to-br from-[#ffd700]/10 to-transparent">
        <Meteors number={8} />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconCurrencyDollar className="h-16 w-16 text-[#ffd700]/30" />
        </div>
      </div>
    ),
  },
  {
    title: "Equity Phantom",
    description:
      "Blockchain agent for transparent equity distribution on Sepolia testnet.",
    icon: <IconLink className="h-6 w-6 text-[#00d4ff]" />,
    className: "md:col-span-2",
    header: (
      <div className="relative h-full min-h-[8rem] rounded-xl overflow-hidden bg-gradient-to-br from-[#00d4ff]/10 to-transparent">
        <Meteors number={10} />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconLink className="h-16 w-16 text-[#00d4ff]/30" />
        </div>
      </div>
    ),
  },
  {
    title: "Pitch Poltergeist",
    description:
      "AI-powered pitch deck generator using Gemini Pro 1.5 for compelling presentations.",
    icon: <IconPresentation className="h-6 w-6 text-[#ff6b35]" />,
    className: "md:col-span-1",
    header: (
      <div className="relative h-full min-h-[8rem] rounded-xl overflow-hidden bg-gradient-to-br from-[#ff6b35]/10 to-transparent">
        <Meteors number={8} />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconPresentation className="h-16 w-16 text-[#ff6b35]/30" />
        </div>
      </div>
    ),
  },
  {
    title: "Shadow Scout",
    description:
      "Competitive intelligence agent that spies on competitors and provides insights.",
    icon: <IconSpy className="h-6 w-6 text-[#9ca3af]" />,
    className: "md:col-span-1",
    header: (
      <div className="relative h-full min-h-[8rem] rounded-xl overflow-hidden bg-gradient-to-br from-[#9ca3af]/10 to-transparent">
        <Meteors number={8} />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconSpy className="h-16 w-16 text-[#9ca3af]/30" />
        </div>
      </div>
    ),
  },
  {
    title: "News Banshee",
    description:
      "Real-time industry news aggregation and analysis for informed decisions.",
    icon: <IconNews className="h-6 w-6 text-[#00d4ff]" />,
    className: "md:col-span-1",
    header: (
      <div className="relative h-full min-h-[8rem] rounded-xl overflow-hidden bg-gradient-to-br from-[#00d4ff]/10 to-transparent">
        <Meteors number={8} />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconNews className="h-16 w-16 text-[#00d4ff]/30" />
        </div>
      </div>
    ),
  },
  {
    title: "Investor Ghoul",
    description:
      "VC Roast Mode - brutally honest feedback on your startup from an investor perspective.",
    icon: <IconFlame className="h-6 w-6 text-[#ff3366]" />,
    className: "md:col-span-1",
    header: (
      <div className="relative h-full min-h-[8rem] rounded-xl overflow-hidden bg-gradient-to-br from-[#ff3366]/10 to-transparent">
        <Meteors number={8} />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconFlame className="h-16 w-16 text-[#ff3366]/30" />
        </div>
      </div>
    ),
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Your <span className="gradient-text">Phantom Team</span>
          </h2>
          <p className="text-lg text-[#9ca3af] max-w-2xl mx-auto">
            8 specialized AI agents working autonomously to help you build,
            grow, and scale your startup.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <BentoGrid className="max-w-5xl mx-auto">
          {agents.map((agent, i) => (
            <BentoGridItem
              key={i}
              title={agent.title}
              description={agent.description}
              header={agent.header}
              icon={agent.icon}
              className={agent.className}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default Features;
