import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { MusicTrack } from "@/lib/admin-types";
import { Badge } from "@/components/ui/badge";
import { DeleteMusicTrackButton } from "./_components/delete-button";

async function getMusicTracks(): Promise<MusicTrack[]> {
    const musicCol = collection(db, 'music');
    const q = query(musicCol, orderBy("createdAt", "desc"));
    const musicSnapshot = await getDocs(q);
    const musicList = musicSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            musicUrl: data.musicUrl,
            coverImageUrl: data.coverImageUrl,
            isFeatured: data.isFeatured,
            isPublished: data.isPublished,
            createdAt: data.createdAt,
        } as MusicTrack;
    });
    return musicList;
}

export default async function MusicManagementPage() {
    const tracks = await getMusicTracks();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-headline font-bold text-primary">MUSIC MANAGEMENT</h2>
                <Button className="btn-gold" asChild>
                    <Link href="/admin/music/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Track
                    </Link>
                </Button>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Cover</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead>Featured</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tracks.length > 0 ? (
                                tracks.map(track => (
                                    <TableRow key={track.id}>
                                        <TableCell>
                                            <Image
                                                src={track.coverImageUrl || "https://placehold.co/100x100"}
                                                alt={track.title}
                                                width={60}
                                                height={60}
                                                className="rounded-md object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{track.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={track.isPublished ? "default" : "secondary"} className="text-xs">
                                                {track.isPublished ? 'Yes' : 'No'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                             <Badge variant={track.isFeatured ? "default" : "secondary"} className="text-xs">
                                                {track.isFeatured ? 'Yes' : 'No'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/music/edit/${track.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DeleteMusicTrackButton trackId={track.id} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No music tracks found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
