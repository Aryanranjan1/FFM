

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addVideo, type VideoFormValues, fetchYouTubeDetails, updateVideo } from "@/app/actions";
import type { Video } from "@/lib/admin-types";

import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const videoSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  videoId: z.string().min(11, "Please enter a valid YouTube URL or Video ID."),
  category: z.string().optional(),
  thumbnailUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type VideoFormProps = {
  video?: Video | null;
};

const getYouTubeId = (urlOrId: string) => {
    if (!urlOrId) return null;
    if (urlOrId.length === 11 && !urlOrId.includes('/')) return urlOrId;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export function VideoForm({ video }: VideoFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: video?.title || "",
      videoId: video ? getYouTubeId(video.videoUrl) || "" : "",
      category: video?.category || "",
      thumbnailUrl: video?.thumbnailUrl || "",
      isPublished: video?.isPublished ?? true,
      isFeatured: video?.isFeatured || false,
    },
  });

  const videoIdValue = form.watch("videoId");
  const pageTitle = video ? "EDIT VIDEO" : "ADD NEW VIDEO";
  const actionText = video ? "Save Changes" : "Create Video";

  const handleFetchYouTubeDetails = async () => {
    const videoId = getYouTubeId(videoIdValue);
    if (!videoId) {
      toast({
        title: "Invalid ID",
        description: "Please provide a valid YouTube URL or Video ID.",
        variant: "destructive",
      });
      return;
    }
    
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    setIsFetching(true);
    try {
      const details = await fetchYouTubeDetails(videoUrl);
      if (details.success && details.data) {
        form.setValue("title", details.data.title, { shouldValidate: true });
        form.setValue("thumbnailUrl", `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, { shouldValidate: true });
        toast({
          title: "Success",
          description: "YouTube details fetched successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: details.error || "Failed to fetch YouTube details.",
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
        title: "Error",
        description: "An unexpected error occurred while fetching details.",
        variant: "destructive",
      });
    }
    setIsFetching(false);
  };

  const onSubmit = async (values: VideoFormValues) => {
    setIsSubmitting(true);
    const result = video ? await updateVideo(video.id, values) : await addVideo(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      router.push('/admin/videos');
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/videos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-headline font-bold text-primary">{pageTitle}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
          <CardDescription>Fill in the information for the video.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="videoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL or ID</FormLabel>
                     <div className="flex gap-2">
                        <FormControl>
                            <Input placeholder="e.g., dQw4w9WgXcQ or full YouTube URL" {...field} />
                        </FormControl>
                        {videoIdValue && (
                           <Button type="button" onClick={handleFetchYouTubeDetails} disabled={isFetching}>
                               {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Youtube className="mr-2 h-4 w-4" />}
                               Fetch
                           </Button>
                        )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter video title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Live Performance, Tutorial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://img.youtube.com/vi/.../hqdefault.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Published</FormLabel>
                      <CardDescription>
                        The video will be visible on the public website.
                      </CardDescription>
                    </div>
                  </FormItem>
                )}
              />
              
               <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <CardDescription>
                        Featured videos may be highlighted on the website.
                      </CardDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="btn-gold">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {actionText}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
