"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { IconMail, IconLock, IconBrandGoogle, IconLoader2 } from "@tabler/icons-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login, loginWithGooglePopup, resetPassword, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (resetMode) {
        await resetPassword(email);
        setResetSent(true);
      } else {
        await login(email, password);
        router.push("/dashboard");
      }
    } catch (error) {
      setError(
        resetMode
          ? "Failed to send reset email. Please check your email address."
          : "Failed to log in. Please check your credentials."
      );
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGooglePopup();
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to log in with Google.");
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
          <h1 className="text-3xl font-bold text-white mb-2">
            {resetMode ? "Reset Password" : "Welcome Back"}
          </h1>
          <p className="text-[#9ca3af]">
            {resetMode
              ? "Enter your email to receive a reset link"
              : "Sign in to access your phantom team"}
          </p>
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

        {resetSent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-sm"
          >
            Password reset email sent! Check your inbox.
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {!resetMode && (
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
          )}

          <button
            type="submit"
            disabled={loading}
            className="ghost-button-primary w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <IconLoader2 className="w-5 h-5 animate-spin" />}
            {resetMode ? "Send Reset Link" : "Sign In"}
          </button>
        </form>

        {!resetMode && (
          <>
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
              onClick={handleGoogleLogin}
              disabled={loading}
              className="ghost-button w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <IconBrandGoogle className="w-5 h-5" />
              Google
            </button>
          </>
        )}

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => {
              setResetMode(!resetMode);
              setError("");
              setResetSent(false);
            }}
            className="text-[#00d4ff] hover:text-[#00b8e6] transition-colors text-sm"
          >
            {resetMode ? "Back to Sign In" : "Forgot your password?"}
          </button>
          {!resetMode && (
            <p className="text-[#9ca3af] text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#00d4ff] hover:text-[#00b8e6] transition-colors"
              >
                Sign up
              </Link>
            </p>
          )}
        </div>
      </CardSpotlight>
    </motion.div>
  );
}
