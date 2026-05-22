
type Props = {
  params: Promise<{
    username: string;
  }>;
};


const Page = async ({ params }: Props) => {
  const { username } = await params;

  const normalizeUsername = decodeURIComponent(
    username
  ).toLowerCase();

  if (normalizeUsername[0] !== "@") {
    return (
      <div className="p-10 text-red-500">
        Invalid username: {normalizeUsername}
      </div>
    );
  }

  const cleanUsername = normalizeUsername.replace("@", "");

  return (
    <div className="mt-10">
      <div
        className="
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-900/40
              p-6
            "
      >
        <h2 className="text-xl font-semibold text-white">
          Welcome to @{cleanUsername}, {}
        </h2>

        <p className="mt-3 text-zinc-400">
          This is your YouTube clone channel page.
        </p>
      </div>
    </div>
  );
};

export default Page;