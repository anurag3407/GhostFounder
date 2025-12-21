"use client";

import { Hero, Features, Navbar, FloatingNav, Footer } from "@/components/landing";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <FloatingNav />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
