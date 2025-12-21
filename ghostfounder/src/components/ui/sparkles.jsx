"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SparklesCore = ({
  background,
  minSize = 0.5,
  maxSize = 2,
  particleDensity = 50,
  className,
  particleColor = "#00d4ff",
}) => {
  const particles = useMemo(() => {
    const newParticles = [];
    for (let i = 0; i < particleDensity; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2,
      });
    }
    return newParticles;
  }, [minSize, maxSize, particleDensity]);

  return (
    <div
      className={cn("h-full w-full absolute inset-0 overflow-hidden", className)}
      style={{
        background: background || "transparent",
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particleColor,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default SparklesCore;
