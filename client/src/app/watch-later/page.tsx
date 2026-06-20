"use client";

import AppShell from "@/layout/AppShell";
import AuthGuard from "@/components/common/AuthGuard";
import WatchLaterClient from "@/features/playlists/components/watchLater/WatchLaterClient";

const WatchLaterPage = () => {
  return (
    <AuthGuard>
      <AppShell>
        <WatchLaterClient />
      </AppShell>
    </AuthGuard>
  );
};

export default WatchLaterPage;
