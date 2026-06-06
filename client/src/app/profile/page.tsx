"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  FiMail,
  FiVideo,
  FiDownload,
  FiClock,
  FiLogOut,
  FiSettings,
  FiTrendingUp,
} from "react-icons/fi";

import { HiOutlineBadgeCheck } from "react-icons/hi";

const userData = {
  name: "Kaushik",
  email: "kaushik@example.com",
  plan: "Premium",
  videosWatched: 42,
  downloadsLeft: 3,
  totalDownloads: 10,
  watchTime: "12h 45m",
};

const subscriptionData = [
  { name: "Used", value: 2 },
  { name: "Remaining", value: 8 },
];

const COLORS = ["#22c55e", "#facc15"];

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-6 bg-black text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src="https://github.com/shadcn.png"
            className="w-16 h-16 rounded-full border border-white/10"
          />

          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {userData.name}
              <HiOutlineBadgeCheck className="text-blue-500" />
            </h1>

            <p className="text-sm text-white/60 flex items-center gap-2">
              <FiMail /> {userData.email}
            </p>

            <span className="text-xs px-2 py-1 bg-white/10 rounded-full mt-1 inline-block">
              {userData.plan} Plan
            </span>
          </div>
        </div>

        <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
          <FiSettings />
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* ACCOUNT CARD */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Account Overview</h2>

          <div className="space-y-3 text-sm text-white/80">
            <p className="flex items-center gap-2">
              <FiVideo /> Videos Watched: {userData.videosWatched}
            </p>

            <p className="flex items-center gap-2">
              <FiDownload /> Downloads Left: {userData.downloadsLeft}
            </p>

            <p className="flex items-center gap-2">
              <FiClock /> Watch Time: {userData.watchTime}
            </p>
          </div>
        </div>

        {/* CHART */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Download Usage</h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData}
                  dataKey="value"
                  outerRadius={90}
                >
                  {subscriptionData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-white/50 text-center mt-2">
            Green = Used • Yellow = Remaining
          </p>
        </div>

        {/* ACTIONS */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-black font-medium hover:opacity-90">
              <FiTrendingUp /> Upgrade Plan
            </button>

            <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
              Manage Subscription
            </button>

            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={<FiDownload />} title="Total Downloads" value="10" />
        <Stat icon={<FiDownload />} title="Used Downloads" value="7" />
        <Stat icon={<FiClock />} title="Watch Time" value="12h" />
        <Stat icon={<FiVideo />} title="Videos Watched" value="42" />
      </div>
    </div>
  );
}

/* STATS COMPONENT */
function Stat({ title, value, icon }: any) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
      <div className="flex items-center justify-between text-white/60 text-sm">
        <span>{title}</span>
        <span>{icon}</span>
      </div>

      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
}