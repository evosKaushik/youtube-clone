import AppShell from "@/layout/AppShell";
import WatchLaterClient from "@/components/watchLater/WatchLaterClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch Later | YouTube Clone",
  description: "Videos you saved to watch later",
};

const WatchLaterPage = () => {
  return (
    <AppShell>
      <WatchLaterClient />
    </AppShell>
  );
};

export default WatchLaterPage;
