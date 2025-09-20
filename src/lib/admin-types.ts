
import type { Timestamp } from "firebase/firestore";

export type MusicTrack = {
  id: string;
  title: string;
  musicUrl: string;
  coverImageUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Timestamp;
};

export type Video = {
  id: string;
  title: string;
  videoUrl: string;
  description?: string;
  tags?: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Timestamp;
};
