"use client";

import Link from "next/link";
import { IconGhost2, IconBrandGithub, IconBrandTwitter, IconBrandLinkedin } from "@tabler/icons-react";

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <IconGhost2 className="w-8 h-8 text-[#00d4ff]" />
              <span className="text-xl font-bold">
                <span className="gradient-text">Ghost</span>
                <span className="text-white">Founder</span>
              </span>
            </Link>
            <p className="text-[#9ca3af] max-w-md">
              Your AI-powered phantom team for startup success. 8 specialized agents
              working autonomously to help you build, grow, and scale.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9ca3af] hover:text-[#00d4ff] transition-colors"
              >
                <IconBrandGithub className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9ca3af] hover:text-[#00d4ff] transition-colors"
              >
                <IconBrandTwitter className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9ca3af] hover:text-[#00d4ff] transition-colors"
              >
                <IconBrandLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-[#9ca3af] hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#agents" className="text-[#9ca3af] hover:text-white transition-colors">
                  Agents
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-[#9ca3af] hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-[#9ca3af] hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-[#9ca3af] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#9ca3af] hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-[#9ca3af] hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#9ca3af] text-sm">
            © {new Date().getFullYear()} GhostFounder. All rights reserved.
          </p>
          <p className="text-[#9ca3af] text-sm">
            Powered by <span className="text-[#00d4ff]">Gemini 2.5+</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
