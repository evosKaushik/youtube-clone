"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const userData = {
  name: "Kaushik",
  email: "kaushik@example.com",
  plan: "Premium",
  videosWatched: 42,
  downloadsLeft: 3,
  totalDownloads: 10,
};

const subscriptionData = [
  { name: "Used", value: 2 },
  { name: "Remaining", value: 28 },
];

const COLORS = ["#4ade80", "#facc15"];

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src="https://github.com/shadcn.png"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{userData.name}</h1>
          <p className="opacity-70">{userData.email}</p>
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* USER INFO */}
        <div className="p-5 rounded-xl bg-[var(--card)] border border-white/10">
          <h2 className="text-lg font-semibold mb-3">Account Info</h2>

          <div className="space-y-2 text-sm">
            <p>📧 Email: {userData.email}</p>
            <p>💎 Plan: {userData.plan}</p>
            <p>🎥 Videos Watched: {userData.videosWatched}</p>
            <p>⬇ Downloads Left: {userData.downloadsLeft}</p>
          </div>
        </div>

        {/* SUBSCRIPTION PIE CHART */}
        <div className="p-5 rounded-xl bg-[var(--card)] border border-white/10">
          <h2 className="text-lg font-semibold mb-3">
            Subscription Usage
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="p-5 rounded-xl bg-background border border-white/10">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>

          <div className="flex flex-col gap-3">
            <button className="px-4 py-2 rounded-lg bg-green-500 text-black font-medium">
              Upgrade Plan
            </button>

            <button className="px-4 py-2 rounded-lg bg-white/10">
              Manage Subscription
            </button>

            <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER STATS */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Total Downloads" value="10" />
        <Stat title="Used Downloads" value="7" />
        <Stat title="Remaining" value="3" />
        <Stat title="Watch Time" value="12h" />
      </div>
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="p-4 rounded-xl bg-background border border-white/10 text-center">
      <p className="text-sm opacity-70">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}