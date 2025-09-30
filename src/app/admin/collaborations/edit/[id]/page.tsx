
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import type { Collaboration } from "@/lib/admin-types";
import { CollaborationForm } from "../../_components/collaboration-form";
import { notFound } from "next/navigation";

async function getCollaboration(id: string): Promise<Collaboration | null> {
  const collabRef = doc(db, 'collaborations', id);
  const collabSnap = await getDoc(collabRef);

  if (!collabSnap.exists()) {
    return null;
  }
  
  const data = collabSnap.data();
  return { 
    id: collabSnap.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate() : new Date(),
  } as Collaboration;
}


export default async function EditCollaborationPage({ params }: { params: { id: string } }) {
  const collaboration = await getCollaboration(params.id);

  if (!collaboration) {
    notFound();
  }

  return (
      <CollaborationForm collaboration={collaboration} />
  );
}
