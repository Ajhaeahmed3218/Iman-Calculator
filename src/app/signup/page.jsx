"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Auto sign in after successful registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account created but sign in failed. Please sign in manually.");
        router.push("/signin");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-[#0f0f23]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#9543FF]/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#9543FF] mb-2">
              Create Account
            </h1>
            <p className="text-gray-400">Join us and start your journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-[#9543FF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#9543FF] transition-colors"
              />
            </div>

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

            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-[#9543FF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#9543FF] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#9543FF] text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-[#7a35d4] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#9543FF]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#9543FF] hover:text-[#7a35d4] font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
