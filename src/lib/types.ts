export type Track = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioSrc: string;
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  releaseYear: number;
  coverArtId: string;
  tracks: Track[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageId: string;
  date: string;
};

export type Bio = {
  content: string;
  pressReleases: {
    title: string;
    publication: string;
    date: string;
    url: string;
  }[];
};

export interface Collaboration {
    name: string;
    role: string;
    description: string;
    link: string;
    image: string;
}
  
export interface Achievement {
    title: string;
    description: string;
    year: string;
    icon: string;
}
