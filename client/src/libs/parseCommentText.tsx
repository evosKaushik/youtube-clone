import Link from "next/link";
import type { ReactNode } from "react";

const COMMENT_TOKEN_REGEX =
  /(https?:\/\/[^\s]+|@[a-zA-Z0-9_]+|#[a-zA-Z0-9_]+|\*\*[^*]+\*\*|_[^_]+_)/g;

export const parseCommentText = (text?: string): ReactNode[] => {
  const value = text ?? "";
  if (!value) return [""];

  return value.split(COMMENT_TOKEN_REGEX).map((part, index) => {
    if (!part) return null;

    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={`url-${index}`}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="text-sky-400 hover:text-sky-300 underline break-all"
        >
          {part}
        </a>
      );
    }

    if (/^@[a-zA-Z0-9_]+$/.test(part)) {
      const username = part.slice(1);

      return (
        <Link
          key={`mention-${index}`}
          href={`/@${username}`}
          className="text-sky-400 hover:text-sky-300"
        >
          {part}
        </Link>
      );
    }

    if (/^#[a-zA-Z0-9_]+$/.test(part)) {
      const hashtag = part.slice(1);

      return (
        <Link
          key={`hashtag-${index}`}
          href={`/results?search_query=%23${encodeURIComponent(hashtag)}`}
          className="text-sky-400 hover:text-sky-300"
        >
          {part}
        </Link>
      );
    }

    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (/^_[^_]+_$/.test(part)) {
      return <em key={`italic-${index}`}>{part.slice(1, -1)}</em>;
    }

    return <span key={`text-${index}`}>{part}</span>;
  }).filter(Boolean) as ReactNode[];
};
