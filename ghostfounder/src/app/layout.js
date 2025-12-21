import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GhostFounder | AI-Powered Phantom Team for Startups",
  description:
    "Build, grow, and scale your startup with 8 specialized AI agents. Autonomous code review, financial analysis, pitch deck generation, and more.",
  keywords: [
    "AI agents",
    "startup",
    "code review",
    "CFO",
    "pitch deck",
    "automation",
    "Gemini",
  ],
  openGraph: {
    title: "GhostFounder | AI-Powered Phantom Team for Startups",
    description:
      "Build, grow, and scale your startup with 8 specialized AI agents.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f] text-white`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
