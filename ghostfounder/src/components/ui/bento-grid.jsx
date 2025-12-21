"use client";

import { cn } from "@/lib/utils";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-none p-4 bg-gradient-to-br from-[#1a1a25]/80 to-[#12121a]/90 border border-white/[0.08] justify-between flex flex-col space-y-4 cursor-pointer",
        "hover:border-white/[0.15] hover:shadow-[0_0_40px_rgba(0,212,255,0.15)]",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <div className="font-sans font-bold text-neutral-200 text-lg">
            {title}
          </div>
        </div>
        <div className="font-sans font-normal text-neutral-400 text-sm">
          {description}
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
