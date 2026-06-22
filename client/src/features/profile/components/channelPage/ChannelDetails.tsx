import Image from "next/image"
import Link from "next/link"
import { FaBell, FaChevronDown, FaUsers, FaYoutube } from "react-icons/fa"

type props = {
    username: string
    channelName?: string
    profilePicture?: string
    subscriberCount?: number
    videoCount?: number
    channelDescription?: string
}

const ChannelDetails = ({
    username,
    channelName,
    profilePicture,
    subscriberCount,
    videoCount,
    channelDescription,
}: props) => {
    const displayChannelName = channelName || username;
    const avatar = profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayChannelName)}&background=18181b&color=fff`;
    return (
        <div
            className="
            mt-4
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-start
          "
        >
            {/* Avatar */}
            <div
                className="
              relative
              h-28
              w-28
              sm:h-36
              sm:w-36
              overflow-hidden
              rounded-full
              border-4
              border-black
              shrink-0
            "
            >
                <Image
                    src={avatar}
                    alt="Profile"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Content */}
            <div className="flex-1">
                {/* Name */}
                <div className="space-y-2">
                    <h1
                        className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  text-white
                "
                    >
                        {displayChannelName}
                    </h1>

                    <div
                        className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  text-sm
                  text-secondaryText
                "
                    >
                        <span className="font-semibold text-white">
                            @{username}
                        </span>

                        <span>•</span>

                        <span>{subscriberCount ?? 0} subscribers</span>

                        <span>•</span>

                        <span>{videoCount ?? 0} videos</span>
                    </div>

                    <p
                        className="
                  max-w-3xl
                  text-sm
                  text-secondaryText
                  leading-relaxed
                "
                    >
                        {channelDescription || "No channel description yet."}
                    </p>

                    {/* Links */}
                    <div
                        className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                  text-sm
                "
                    >
                        <Link
                            href={`/results?search_query=@${username}`}
                            className="
                    text-blue-500
                    hover:underline
                  "
                        >
                            @{username}
                        </Link>

                        <span className="text-secondaryText">
                            channel links coming soon
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div
                    className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-3
              "
                >
                    {/* Subscribe */}
                    <button
                        className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-card
                  px-5
                  py-2.5
                  font-medium
                  text-text
                  hover:bg-hover
                  transition
                "
                    >
                        <FaBell size={18} />

                        <span>Subscribed</span>

                        <FaChevronDown size={18} />
                    </button>

                    {/* Join */}
                    <button
                        className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-card
                  px-5
                  py-2.5
                  font-medium
                  text-text
                  hover:bg-hover
                  transition
                "
                    >
                        <FaYoutube />

                        <span>Join</span>
                    </button>

                    {/* Community */}
                    <button
                        className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-card
                  px-5
                  py-2.5
                  font-medium
                  text-text
                  hover:bg-hover
                  transition
                "
                    >
                        <FaUsers size={18} />

                        <span>Community</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChannelDetails
