"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock } from "react-icons/md";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/profile" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0f0f23]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#9543FF]/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#9543FF] mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsSignIn} className="space-y-5">
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-[#9543FF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#9543FF] transition-colors"
              />
            </div>

            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-[#9543FF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#9543FF] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#9543FF] text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-[#7a35d4] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#9543FF]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0f0f23] text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 bg-white text-gray-800 font-semibold rounded-lg flex items-center justify-center gap-3 transition duration-300 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            <FcGoogle className="text-2xl" />
            Sign in with Google
          </button>

          <p className="mt-8 text-center text-gray-400">
            {"Don't have an account? "}
            <Link
              href="/signup"
              className="text-[#9543FF] hover:text-[#7a35d4] font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
