"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Meteors = ({ number = 20, className }) => {
  const meteors = useMemo(() => {
    return Array.from({ length: number }, (_, idx) => ({
      id: idx,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${Math.random() * 2 + 2}s`,
    }));
  }, [number]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-[#00d4ff] shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: "-5%",
            left: meteor.left,
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
          }}
        >
          <span className="absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-[#00d4ff] to-transparent" />
        </span>
      ))}
      <style jsx>{`
        @keyframes meteor {
          0% {
            transform: rotate(215deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(215deg) translateX(-500px);
            opacity: 0;
          }
        }
        .animate-meteor {
          animation: meteor 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Meteors;
