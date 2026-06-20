import AppShell from "@/layout/AppShell";
import ChannelDetails from "@/features/profile/components/channelPage/ChannelDetails";
import CategoriesTabs from "@/features/profile/components/channelPage/CategoriesTabs";
import ChannelVideoUploader from "@/features/profile/components/channelPage/ChannelVideoUploader";
import type { Metadata } from "next";

type Props = {
    params: Promise<{
        username: string;
    }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params;
    const normalized = decodeURIComponent(username).toLowerCase();
    const cleanUsername = normalized.startsWith("@")
        ? normalized.slice(1)
        : normalized;

    return {
        title: `@${cleanUsername} | YouTube Clone`,
        description: `Channel page for @${cleanUsername}`,
    };
}

const Layout = async ({
    params,
    children,
}: Props) => {
    const { username } = await params;

    const normalizeUsername =
        decodeURIComponent(username).toLowerCase();

    if (normalizeUsername[0] !== "@") {
        return (
            <div className="p-10 text-red-500">
                Invalid username: {normalizeUsername}
            </div>
        );
    }

    const cleanUsername =
        normalizeUsername.replace("@", "");

    return (
        <AppShell>
            <section className="container mx-auto px-3 lg:px-8 py-4">
                {/* Banner */}
                <div
                    className="
            relative
            h-36
            sm:h-44
            md:h-56
            w-full
            overflow-hidden
            rounded-2xl
            bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-900
            flex items-center px-6
          "
                >
                    <p className="text-xl md:text-3xl font-semibold text-white/90">
                        @{cleanUsername}
                    </p>
                </div>

                {/* Channel Details */}
                <ChannelDetails
                    username={cleanUsername}
                    channelName={cleanUsername}
                />

                {/* Upload Box */}
                <ChannelVideoUploader />

                {/* Tabs */}
                <CategoriesTabs
                    username={cleanUsername}
                />

                {/* Dynamic Content */}
                <div className="mt-6">
                    {children}
                </div>
            </section>
        </AppShell>
    );
};

export default Layout;