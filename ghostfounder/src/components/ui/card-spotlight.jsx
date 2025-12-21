"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#00d4ff33",
  className,
  ...props
}) => {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#1a1a25]/80 to-[#12121a]/90 overflow-hidden",
        className
      )}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute z-0 transition duration-300"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        style={{
          background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${color}, transparent 80%)`,
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CardSpotlight;
