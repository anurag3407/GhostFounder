"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import {
  IconMail,
  IconLock,
  IconUser,
  IconBrandGoogle,
  IconLoader2,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGooglePopup, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const passwordRequirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Passwords match", met: password === confirmPassword && password.length > 0 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password should be at least 6 characters");
    }

    setLoading(true);
    try {
      await signup(email, password, displayName);
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to create an account. " + error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGooglePopup();
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to sign up with Google.");
    }
    setLoading(false);
  };

  if (currentUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <CardSpotlight className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join the Phantom Team</h1>
          <p className="text-[#9ca3af]">Create your account and start building</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-[#ff3366]/10 border border-[#ff3366]/20 text-[#ff3366] text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">
              Display Name
            </label>
            <div className="relative">
              <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="ghost-input w-full pl-10"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">
              Email Address
            </label>
            <div className="relative">
              <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ghost-input w-full pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">
              Password
            </label>
            <div className="relative">
              <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ghost-input w-full pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="ghost-input w-full pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="space-y-2">
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {req.met ? (
                  <IconCheck className="w-4 h-4 text-[#00ff88]" />
                ) : (
                  <IconX className="w-4 h-4 text-[#9ca3af]" />
                )}
                <span className={req.met ? "text-[#00ff88]" : "text-[#9ca3af]"}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ghost-button-primary w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <IconLoader2 className="w-5 h-5 animate-spin" />}
            Create Account
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#12121a] text-[#9ca3af]">
              or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="ghost-button w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <IconBrandGoogle className="w-5 h-5" />
          Google
        </button>

        <p className="mt-6 text-center text-[#9ca3af] text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#00d4ff] hover:text-[#00b8e6] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardSpotlight>
    </motion.div>
  );
}
