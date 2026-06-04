export type Creator = {
  _id: string;
  channelName?: string | null;
  profilePicture?: string | null;
  channelUsername?: string | null;
  subscriberCount?: number;
};

export type Video = {
  _id: string;
  name: string;
  description: string;
  thumbnailURL: string;
  videoURL: string;
  createdAt: string;
  likes: number;
  views?: number;
  duration?: number;
  creatorId: Creator;
};

export type UserSummary = {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
  city?: string;
};

export type Comment = {
  _id?: string;
  userId: UserSummary;
  body: string;
  createdAt?: string;
};

export type PlaylistItem = {
  _id: string;
  videoId: Video;
  userId: string;
  type: "like" | "watchLater";
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};
