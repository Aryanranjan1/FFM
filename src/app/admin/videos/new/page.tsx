
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addVideo, type VideoFormValues, fetchYouTubeDetails } from "@/app/actions";

import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const videoSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  videoUrl: z.string().url("Please enter a valid YouTube URL."),
  description: z.string().optional(),
  tags: z.string().optional(),
  thumbnailUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export default function NewVideoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      videoUrl: "",
      description: "",
      tags: "",
      thumbnailUrl: "",
      isPublished: true,
      isFeatured: false,
    },
  });

  const videoUrl = form.watch("videoUrl");

  const handleFetchYouTubeDetails = async () => {
    if (!videoUrl.includes("youtube.com")) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid YouTube URL.",
        variant: "destructive",
      });
      return;
    }
    setIsFetching(true);
    try {
      const details = await fetchYouTubeDetails(videoUrl);
      if (details.success && details.data) {
        form.setValue("title", details.data.title, { shouldValidate: true });
        form.setValue("description", details.data.description, { shouldValidate: true });
        form.setValue("thumbnailUrl", details.data.thumbnailUrl, { shouldValidate: true });
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
    const result = await addVideo(values);
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
        <h2 className="text-3xl font-headline font-bold text-primary">ADD NEW VIDEO</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
          <CardDescription>Fill in the information for the new video.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL</FormLabel>
                     <div className="flex gap-2">
                        <FormControl>
                            <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        {videoUrl.includes("youtube.com") && (
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Video description" {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated, optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., cinematic, tutorial, live" {...field} />
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
                      <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
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
                        name={field.name}
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
                        name={field.name}
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
                Create Video
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
