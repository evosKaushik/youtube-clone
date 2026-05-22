import Image from "next/image";

import AppShell from "@/layout/AppShell";
import ChannelDetails from "@/components/channelPage/ChannelDetails";
import CategoriesTabs from "@/components/channelPage/CategoriesTabs";
import ChannelVideoUploader from "@/components/channelPage/ChannelVideoUploader";


type Props = {
    params: Promise<{
        username: string;
    }>;
    children: React.ReactNode;
};

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
            bg-zinc-800
          "
                >
                    <Image
                        src="https://yt3.googleusercontent.com/-bmEdlnynX09WL0Dqbxm7zPF3UaIsCrRz_Vm8GoiabNhwFXnJxlvmF7-38Vd2wMfIBDhPZ-ddA=w1138-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj"
                        alt="Banner"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                {/* Channel Details */}
                <ChannelDetails
                    username={cleanUsername}
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