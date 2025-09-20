import type { Timestamp } from "firebase/firestore";

export type MusicTrack = {
  id: string;
  title: string;
  musicUrl: string;
  coverImageUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Timestamp | string;
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
  createdAt: Timestamp | string;
};

export type Testimonial = {
  id: string;
  author: string;
  publication: string;
  quote: string;
  createdAt: Timestamp;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  createdAt: Timestamp;
};