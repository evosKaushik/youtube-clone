import Image from "next/image"
import Link from "next/link"
import { FaBell, FaChevronDown, FaUsers, FaYoutube } from "react-icons/fa"

type props = {
    username: string
}

const ChannelDetails = ({ username }: props) => {
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
                    src="https://yt3.googleusercontent.com/QQi62BHmnTzE4t3QuLXYAbhbOJXz3Xs0dqps_u_9S4BKutYQ0uL-r2gPxDbU3JFVnKpW69pcqA=s160-c-k-c0x00ffffff-no-rj"
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
                        Anurag Singh Procodrr
                    </h1>

                    <div
                        className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  text-sm
                  text-zinc-400
                "
                    >
                        <span className="font-semibold text-white">
                            @{username}
                        </span>

                        <span>•</span>

                        <span>86.8K subscribers</span>

                        <span>•</span>

                        <span>89 videos</span>
                    </div>

                    <p
                        className="
                  max-w-3xl
                  text-sm
                  text-zinc-400
                  leading-relaxed
                "
                    >
                        Software Engineer | Tech Content Creator | Sharing
                        I help developers to become Procodrrs
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
                            href="#"
                            className="
                    text-blue-500
                    hover:underline
                  "
                        >
                            acedevhub.com
                        </Link>

                        <span className="text-zinc-500">
                            and 3 more links
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
                  bg-zinc-800
                  px-5
                  py-2.5
                  font-medium
                  text-white
                  hover:bg-zinc-700
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
                  bg-zinc-800
                  px-5
                  py-2.5
                  font-medium
                  text-white
                  hover:bg-zinc-700
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
                  bg-zinc-800
                  px-5
                  py-2.5
                  font-medium
                  text-white
                  hover:bg-zinc-700
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
