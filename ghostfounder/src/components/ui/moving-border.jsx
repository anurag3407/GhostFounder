"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  as: Component = "button",
  ...otherProps
}) => {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorderGradient duration={duration} />
      </div>
      <div
        className={cn(
          "relative bg-[#0a0a0f] border border-transparent z-10",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
};

const MovingBorderGradient = ({ duration }) => {
  return (
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        background:
          "linear-gradient(90deg, transparent, #00d4ff, #ffd700, transparent)",
      }}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export default MovingBorder;
