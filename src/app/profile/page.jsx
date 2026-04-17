"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VscAccount, VscSignOut } from "react-icons/vsc";
import { MdEmail, MdHistory, MdTrendingUp } from "react-icons/md";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchQuizResults() {
      if (session?.user?.id) {
        try {
          const res = await fetch("/api/quiz-results");
          if (res.ok) {
            const data = await res.json();
            setQuizResults(data.results || []);
          }
        } catch (error) {
          console.error("Error fetching quiz results:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchQuizResults();
    }
  }, [session, status]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getImanLevel = (percentage) => {
    if (percentage >= 85) return { level: "Strong", color: "text-green-400", bg: "bg-green-500/20" };
    if (percentage >= 60) return { level: "Good", color: "text-blue-400", bg: "bg-blue-500/20" };
    if (percentage >= 40) return { level: "Moderate", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    return { level: "Needs Work", color: "text-red-400", bg: "bg-red-500/20" };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const averageScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((acc, r) => acc + r.percentage, 0) / quizResults.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-[#0f0f23]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-[#9543FF]/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-[#9543FF]/50"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#9543FF]/20 flex items-center justify-center border-4 border-[#9543FF]/50">
                  <VscAccount className="text-4xl text-[#9543FF]" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">
                {session.user?.name || "User"}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                <MdEmail className="text-lg" />
                <span>{session.user?.email}</span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
            >
              <VscSignOut className="text-xl" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0f0f23]/80 backdrop-blur-xl rounded-xl p-5 border border-[#9543FF]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#9543FF]/20 rounded-lg">
                <MdHistory className="text-xl text-[#9543FF]" />
              </div>
              <span className="text-gray-400">Total Quizzes</span>
            </div>
            <p className="text-3xl font-bold text-white">{quizResults.length}</p>
          </div>

          <div className="bg-[#0f0f23]/80 backdrop-blur-xl rounded-xl p-5 border border-[#9543FF]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#9543FF]/20 rounded-lg">
                <MdTrendingUp className="text-xl text-[#9543FF]" />
              </div>
              <span className="text-gray-400">Average Score</span>
            </div>
            <p className="text-3xl font-bold text-white">{averageScore}%</p>
          </div>

          <div className="bg-[#0f0f23]/80 backdrop-blur-xl rounded-xl p-5 border border-[#9543FF]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#9543FF]/20 rounded-lg">
                <VscAccount className="text-xl text-[#9543FF]" />
              </div>
              <span className="text-gray-400">Current Level</span>
            </div>
            {quizResults.length > 0 ? (
              <p className={`text-2xl font-bold ${getImanLevel(averageScore).color}`}>
                {getImanLevel(averageScore).level}
              </p>
            ) : (
              <p className="text-2xl font-bold text-gray-500">N/A</p>
            )}
          </div>
        </div>

        {/* Quiz History */}
        <div className="bg-[#0f0f23]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-[#9543FF]/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MdHistory className="text-[#9543FF]" />
            Quiz History
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading quiz history...</div>
          ) : quizResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You haven&apos;t taken any quizzes yet.</p>
              <Link
                href="/quiz"
                className="inline-block px-6 py-3 bg-[#9543FF] text-white font-semibold rounded-lg hover:bg-[#7a35d4] transition-colors"
              >
                Take Your First Quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {quizResults.map((result, index) => {
                const level = getImanLevel(result.percentage);
                return (
                  <div
                    key={result._id || index}
                    className="flex items-center justify-between p-4 bg-[#1a1a2e]/50 rounded-lg border border-[#9543FF]/10 hover:border-[#9543FF]/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${level.bg} ${level.color}`}>
                        {result.percentage}%
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          Score: {result.score}/{result.totalQuestions * 4}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {formatDate(result.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${level.color}`}>
                      {level.level}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Take Quiz CTA */}
        <div className="text-center">
          <Link
            href="/quiz"
            className="inline-block px-8 py-4 bg-[#9543FF] text-white text-lg font-semibold rounded-xl transition duration-300 ease-in-out hover:bg-[#7a35d4] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#9543FF]/30"
          >
            Take New Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
