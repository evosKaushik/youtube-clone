"use client";

import { useUser } from "@/libs/AuthContext";
import { FiMail, FiVideo, FiDownload, FiClock, FiSettings, FiLogOut, FiTrendingUp, FiUser } from "react-icons/fi";
import { IoCall } from "react-icons/io5";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import AuthGuard from "@/components/common/AuthGuard";
import Link from "next/link";
import Image from "next/image";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEffect, useState, useCallback } from "react";
import { getTodayStatsApi } from "@/api/videoApi";
import { useRouter } from "next/navigation";
import { usePopup } from "@/contexts/popupContext";

const COLORS = ["#22c55e", "#facc15"];

function formatWatchTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hrs}h ${remainMins}m`;
  }
  return `${mins}m ${secs}s`;
}

export default function ProfilePage() {
  const { user, logout, loading } = useUser();
  const { showPopup, hidePopup } = usePopup();
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [todayStats, setTodayStats] = useState({
    todayDownloads: 0,
    todayWatchSeconds: 0,
    totalDownloads: 0,
    totalVideosWatched: 0,
    totalWatchTimeUsed: 0,
    watchTimeLimitMinutes: 5,
    downloadLimit: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getTodayStatsApi();
        console.log(stats)
        setTodayStats(stats);
      } catch (error) {
        console.error(error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);
  
  console.log(todayStats)

  const handleCallBtn = useCallback(() => {
    showPopup({
      header: "Video Call",
      popupMsg: "Create a new room or join an existing room",
      selfClose: true,
      button1: {
        label: "Join Call",
        action: () => {
          showPopup({
            header: "Join Call",
            body: (
              <input
                id="profile-join-room-id"
                defaultValue=""
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Custom Room ID"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text"
              />
            ),
            selfClose: true,
            button1: { label: "Cancel", action: hidePopup },
            button2: {
              label: "Join",
              action: () => {
                const input = document.getElementById("profile-join-room-id") as HTMLInputElement;
                const joinRoomId = input?.value.trim();
                if (!joinRoomId) return;
                router.push(`/call/${joinRoomId}`);
                hidePopup();
              },
            },
          });
        },
      },
      button2: {
        label: "Create Call",
        action: () => {
          showPopup({
            header: "Create Room",
            body: (
              <div className="flex flex-col gap-3">
                <input
                  id="create-room-id"
                  placeholder="Custom Room ID"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
                />
              </div>
            ),
            selfClose: true,
            button1: { label: "Cancel", action: hidePopup },
            button2: {
              label: "Create",
              action: async () => {
                const input = document.getElementById("create-room-id") as HTMLInputElement;
                const roomId = input?.value.trim();
                if (!roomId) return;
                const link = `${window.location.origin}/call/${roomId}`;
                showPopup({
                  header: "Room Created",
                  body: (
                    <div className="flex flex-col gap-3">
                      <input readOnly value={link} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
                    </div>
                  ),
                  selfClose: true,
                  button1: {
                    label: "Copy Link",
                    action: async () => { await navigator.clipboard.writeText(link); },
                  },
                  button2: {
                    label: "Enter Room",
                    action: () => { router.push(`/call/${roomId}`); hidePopup(); },
                  },
                });
              },
            },
          });
        },
      },
    });
  }, [roomId, showPopup, hidePopup, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-card border-t-text" />
      </div>
    );
  }

  const plan = user?.subscription?.plan ?? "Free";
  const email = user?.email ?? "No email";
  const name = user?.name ?? "User";
  const profilePic = user?.profilePicture || "https://github.com/shadcn.png";
  const username = user?.username ?? "user";
  const subscriberCount = user?.subscriberCount ?? 0;

  // Use API stats or fallback to subscription data from the user object
  const downloadLimit = todayStats.downloadLimit ?? user?.subscription?.noOfDownloads ?? 0;
  const watchLimitMinutes = todayStats.watchTimeLimitMinutes ?? user?.subscription?.watchTimeInMinutes ?? 5;

  const stats = {
    videosWatched: todayStats.totalVideosWatched,
    downloadsUsed: todayStats.todayDownloads,
    totalDownloads: downloadLimit,
    watchTime: formatWatchTime(todayStats.todayWatchSeconds),
    totalWatchTimeSeconds: todayStats.totalWatchTimeUsed,
    watchTimeLimitSeconds: watchLimitMinutes * 60,
  };

  const downloadRemaining = downloadLimit === Infinity ? Infinity : Math.max(0, downloadLimit - stats.downloadsUsed);

  // For free users (downloadLimit = 0) the chart would show 0/0 — render a message instead
  const showDownloadChart = downloadLimit > 0;


  const isPremium = plan.toLowerCase() !== "free";
  const isUnlimited = watchLimitMinutes === Infinity;

  // Watch time progress percentage
  const watchTimePercent = isUnlimited
    ? 0
    : Math.min(100, Math.round((stats.totalWatchTimeSeconds / stats.watchTimeLimitSeconds) * 100));

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-text p-4 sm:p-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-border shrink-0">
              <Image
                src={profilePic}
                alt={name}
                fill
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 truncate">
                {name}
                {isPremium && <HiOutlineBadgeCheck className="text-blue-500 shrink-0" />}
              </h1>

              <p className="text-xs sm:text-sm text-secondaryText flex items-center gap-2 truncate">
                <FiMail className="shrink-0" /> {email}
              </p>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs px-2 py-1 bg-card rounded-full">
                  {plan} Plan
                </span>
                <span className="text-xs text-secondaryText">@{username}</span>
                {user?.channelName && (
                  <span className="text-xs text-secondaryText">
                    {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            href="/subscription"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-hover transition text-sm w-fit"
          >
            <FiSettings />
            Manage Plan
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* ACCOUNT CARD */}
          <div className="p-4 sm:p-5 rounded-xl bg-card border border-border">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Account Overview</h2>

            <div className="space-y-3 text-xs sm:text-sm text-secondaryText">
              <p className="flex items-center gap-2">
                <FiVideo className="shrink-0" /> Videos Watched: {stats.videosWatched}
              </p>

              <p className="flex items-center gap-2">
                <FiDownload className="shrink-0" /> Downloads Today: {stats.downloadsUsed}{downloadLimit === Infinity ? "" : ` / ${downloadLimit}`}
              </p>

              <p className="flex items-center gap-2">
                <FiClock className="shrink-0" /> Watch Time Today: {stats.watchTime}
              </p>
            </div>

            {/* Watch Time Limit Progress */}
            {!isUnlimited && (
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-xs font-semibold text-secondaryText uppercase tracking-wider mb-3">
                  Watch Time Used
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-secondaryText">
                  <p className="flex items-center gap-2">
                    <FiClock className="shrink-0 text-blue-500" /> Used: <span className="font-medium text-text">{formatWatchTime(stats.totalWatchTimeSeconds)}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FiClock className="shrink-0 text-yellow-400" /> Limit: <span className="font-medium text-text">{watchLimitMinutes} min</span>
                  </p>
                  <div className="w-full bg-card rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${watchTimePercent}%`,
                        background: watchTimePercent > 80 ? "#ef4444" : watchTimePercent > 50 ? "#facc15" : "#22c55e",
                      }}
                    />
                  </div>
                  <p className="text-xs text-secondaryText flex justify-between">
                    <span>{watchTimePercent}% used</span>
                    <span>{formatWatchTime(Math.max(0, stats.watchTimeLimitSeconds - stats.totalWatchTimeSeconds))} left</span>
                  </p>
                </div>
              </div>
            )}

            {isUnlimited && (
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-xs font-semibold text-secondaryText uppercase tracking-wider mb-3">
                  Watch Time
                </h3>
                <p className="text-xs sm:text-sm text-secondaryText flex items-center gap-2">
                  <FiClock className="shrink-0 text-green-500" />
                  Total Used: <span className="font-medium text-text">{formatWatchTime(stats.totalWatchTimeSeconds)}</span>
                  <span className="text-green-500 text-xs">(Unlimited)</span>
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="text-xs font-semibold text-secondaryText uppercase tracking-wider mb-3">
                Last 24 Hours
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-secondaryText">
                <p className="flex items-center gap-2">
                  <FiDownload className="shrink-0 text-green-500" /> Downloads Today: <span className="font-medium text-text">{todayStats.todayDownloads}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiClock className="shrink-0 text-blue-500" /> Watch Time Today: <span className="font-medium text-text">{formatWatchTime(todayStats.todayWatchSeconds)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className="p-4 sm:p-5 rounded-xl bg-card border border-border">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Download Usage</h2>

            {showDownloadChart ? (
              <>
                <div className="h-48 sm:h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Used", value: stats.downloadsUsed },
                          { name: "Remaining", value: downloadRemaining },
                        ]}
                        dataKey="value"
                        outerRadius={80}
                        innerRadius={40}
                      >
                        {[
                          { name: "Used", value: stats.downloadsUsed },
                          { name: "Remaining", value: downloadRemaining },
                        ].map((_, index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--text)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-secondaryText mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    Used ({stats.downloadsUsed})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    Remaining ({downloadRemaining})
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 sm:h-56 text-secondaryText">
                <FiDownload className="text-4xl mb-3 opacity-40" />
                <p className="text-sm font-medium">No downloads available</p>
                <p className="text-xs mt-1">Upgrade your plan to download videos</p>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="p-4 sm:p-5 rounded-xl bg-card border border-border">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Quick Actions</h2>

            <div className="flex flex-col gap-3">
              <Link
                href="/subscription"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:opacity-90 transition text-sm"
              >
                <FiTrendingUp /> Upgrade Plan
              </Link>

              <Link
                href="/history"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-card hover:bg-hover transition text-sm border border-border"
              >
                <FiClock /> Watch History
              </Link>

              <button
                onClick={handleCallBtn}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-card hover:bg-hover transition text-sm border border-border"
              >
                <IoCall /> Video Call
              </button>

              <Link
                href={`/@${username}`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-card hover:bg-hover transition text-sm border border-border"
              >
                <FiUser /> My Channel
              </Link>

              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Stat icon={<FiDownload />} title="Today Downloads" value={String(stats.downloadsUsed)} />
          <Stat icon={<FiDownload />} title="Daily Limit" value={String(downloadLimit)} />
          <Stat icon={<FiClock />} title="Watch Time Today" value={stats.watchTime} />
          <Stat icon={<FiVideo />} title="Videos Watched" value={String(stats.videosWatched)} />
        </div>
      </div>
    </AuthGuard>
  );
}

function Stat({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="p-3 sm:p-4 rounded-xl bg-card border border-border hover:bg-hover transition">
      <div className="flex items-center justify-between text-secondaryText text-xs sm:text-sm">
        <span>{title}</span>
        <span>{icon}</span>
      </div>

      <p className="text-lg sm:text-xl font-bold mt-2">{value}</p>
    </div>
  );
}
