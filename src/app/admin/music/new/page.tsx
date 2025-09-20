
"use client";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addMusicTrack, type AddMusicTrackState } from "@/app/actions";

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const musicTrackSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  musicUrl: z.string().url("Please enter a valid URL."),
  coverImageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

type MusicTrackFormValues = z.infer<typeof musicTrackSchema>;

const initialState: AddMusicTrackState = {
  message: null,
  errors: {},
};

export default function NewMusicTrackPage() {
  const [state, formAction] = useFormState(addMusicTrack, initialState);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<MusicTrackFormValues>({
    resolver: zodResolver(musicTrackSchema),
    defaultValues: {
      title: "",
      musicUrl: "",
      coverImageUrl: "",
      isFeatured: false,
      isPublished: true,
    },
  });

  useEffect(() => {
    if (state.message) {
      if (Object.keys(state.errors).length > 0) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: state.message,
        });
        router.push('/admin/music');
      }
    }
  }, [state, toast, router]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/music">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-headline font-bold text-primary">ADD NEW MUSIC TRACK</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Track Details</CardTitle>
          <CardDescription>Fill in the information for the new music track.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter track title" {...field} />
                    </FormControl>
                    <FormMessage>{state.errors?.title}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="musicUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Music URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/music.mp3 or YouTube URL" {...field} />
                    </FormControl>
                     <FormMessage>{state.errors?.musicUrl}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/cover.jpg" {...field} />
                    </FormControl>
                    <FormMessage>{state.errors?.coverImageUrl}</FormMessage>
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
                        Featured tracks may be highlighted on the homepage.
                      </CardDescription>
                    </div>
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
                        The track will be visible to the public.
                      </CardDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="btn-gold">Create Track</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
