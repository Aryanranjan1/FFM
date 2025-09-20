
import type { Timestamp } from "firebase/firestore";

export type MusicTrack = {
  id: string;
  title: string;
  musicUrl: string;
  category?: string;
  coverImageUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
};

export type Video = {
  id: string;
  title: string;
  videoUrl: string;
  description?: string;
  tags?: string;
  category?: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
};

export type BlogPost = {
    id: string;
    title: string;
    content: string;
    category: string;
    tags?: string;
    coverImageUrl?: string;
    isPublished: boolean;
    isFeatured: boolean;
    seoTitle?: string;
    seoDescription?: string;
    createdAt: string;
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

export type ContactSubmission = {
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    submittedAt: string;
};
