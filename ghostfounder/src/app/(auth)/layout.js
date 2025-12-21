import { SparklesCore } from "@/components/ui/sparkles";
import Link from "next/link";
import { IconGhost2 } from "@tabler/icons-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <SparklesCore
          background="transparent"
          minSize={0.3}
          maxSize={1}
          particleDensity={30}
          className="w-full h-full"
          particleColor="#00d4ff"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-[#0a0a0f]/80 to-[#0a0a0f]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <IconGhost2 className="w-8 h-8 text-[#00d4ff]" />
          <span className="text-xl font-bold">
            <span className="gradient-text">Ghost</span>
            <span className="text-white">Founder</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
