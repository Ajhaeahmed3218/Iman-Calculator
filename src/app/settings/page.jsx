"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { VscSettingsGear, VscSignOut } from "react-icons/vsc";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="animate-pulse text-[#9543FF] text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[#0f0f23]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-[#9543FF]/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#9543FF]/20 rounded-lg">
              <VscSettingsGear className="text-2xl text-[#9543FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-gray-400">Manage your account preferences</p>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-[#0f0f23]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-[#9543FF]/20">
          <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1a1a2e]/50 rounded-lg border border-[#9543FF]/10">
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-gray-400 text-sm">{session.user?.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a1a2e]/50 rounded-lg border border-[#9543FF]/10">
              <div>
                <p className="text-white font-medium">Name</p>
                <p className="text-gray-400 text-sm">{session.user?.name || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#0f0f23]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-red-500/20">
          <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div>
                <p className="text-white font-medium">Sign Out</p>
                <p className="text-gray-400 text-sm">Sign out of your account on this device</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                <VscSignOut className="text-lg" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Back to Profile */}
        <div className="text-center">
          <Link
            href="/profile"
            className="inline-block px-6 py-3 text-[#9543FF] hover:text-[#7a35d4] font-semibold transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
