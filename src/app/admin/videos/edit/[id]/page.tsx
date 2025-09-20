import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { Video } from "@/lib/admin-types";
import { VideoForm } from "../../_components/video-form";
import { notFound } from "next/navigation";

async function getVideo(id: string): Promise<Video | null> {
  const videoRef = doc(db, 'videos', id);
  const videoSnap = await getDoc(videoRef);

  if (!videoSnap.exists()) {
    return null;
  }
  
  return { id: videoSnap.id, ...videoSnap.data() } as Video;
}

export default async function EditVideoPage({ params }: { params: { id: string } }) {
  const video = await getVideo(params.id);

  if (!video) {
    notFound();
  }

  return (
      <VideoForm video={video} />
  );
}
