
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import type { Video } from "@/lib/admin-types";
import { format } from "date-fns";
import { DeleteVideoButton } from "./_components/delete-button";
import { Badge } from "@/components/ui/badge";

async function getVideos(): Promise<Video[]> {
    const videosCol = collection(db, 'videos');
    const q = query(videosCol, orderBy("createdAt", "desc"));
    const videoSnapshot = await getDocs(q);
    const videoList = videoSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
        } as Video;
    });
    return videoList;
}

export default async function VideosManagementPage() {
    const videos = await getVideos();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-headline font-bold text-primary">VIDEO MANAGEMENT</h2>
                <Button className="btn-gold" asChild>
                    <Link href="/admin/videos/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Video
                    </Link>
                </Button>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Thumbnail</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead>Featured</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {videos.length > 0 ? (
                                videos.map(video => (
                                    <TableRow key={video.id}>
                                        <TableCell>
                                            <Image
                                                src={video.thumbnailUrl || "https://placehold.co/120x68"}
                                                alt={video.title}
                                                width={120}
                                                height={68}
                                                className="rounded-md object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{video.title}</TableCell>
                                        <TableCell>{video.category || 'N/A'}</TableCell>
                                        <TableCell>
                                             <Badge variant={video.isPublished ? "default" : "secondary"}>
                                                {video.isPublished ? 'Yes' : 'No'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                             <Badge variant={video.isFeatured ? "default" : "secondary"}>
                                                {video.isFeatured ? 'Yes' : 'No'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {video.createdAt ? format(new Date(video.createdAt as string), "PPP") : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/videos/edit/${video.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DeleteVideoButton videoId={video.id} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                        No videos found.
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

    