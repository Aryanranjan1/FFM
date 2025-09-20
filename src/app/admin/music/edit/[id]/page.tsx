import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { MusicTrack } from "@/lib/admin-types";
import { MusicTrackForm } from "../../_components/music-track-form";
import { notFound } from "next/navigation";

async function getMusicTrack(id: string): Promise<MusicTrack | null> {
  const trackRef = doc(db, 'music', id);
  const trackSnap = await getDoc(trackRef);

  if (!trackSnap.exists()) {
    return null;
  }
  
  return { id: trackSnap.id, ...trackSnap.data() } as MusicTrack;
}

export default async function EditMusicTrackPage({ params }: { params: { id: string } }) {
  const track = await getMusicTrack(params.id);

  if (!track) {
    notFound();
  }

  return (
      <MusicTrackForm track={track} />
  );
}
