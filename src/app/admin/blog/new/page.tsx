
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addBlogPost, type BlogPostFormValues } from '@/app/actions';

import { ArrowLeft, Bold, Italic, Underline, Strikethrough, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Code, Quote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const blogPostSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  category: z.string().min(2, "Category is required."),
  tags: z.string().optional(),
  coverImageUrl: z.string().url("A valid URL is required.").optional().or(z.literal('')),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export default function NewBlogPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
      coverImageUrl: "",
      seoTitle: "",
      seoDescription: "",
      isPublished: true,
      isFeatured: false,
    },
  });

  const onSubmit = async (values: BlogPostFormValues) => {
    setIsSubmitting(true);
    const result = await addBlogPost(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      router.push('/admin/blog');
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
            <Link href="/admin/blog">
                <ArrowLeft className="h-4 w-4" />
            </Link>
        </Button>
        <h2 className="text-3xl font-headline font-bold text-primary">CREATE NEW BLOG POST</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Main Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Your amazing blog post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <div className="rounded-md border border-input mt-2">
                          <div className="p-2 border-b border-input flex items-center flex-wrap gap-1">
                              <Select defaultValue="font" disabled>
                                  <SelectTrigger className="w-[120px] h-8">
                                      <SelectValue placeholder="Font" />
                                  </SelectTrigger>
                              </Select>
                              <Select defaultValue="size" disabled>
                                  <SelectTrigger className="w-[80px] h-8">
                                      <SelectValue placeholder="Size" />
                                  </SelectTrigger>
                              </Select>
                              <Button type="button" variant="outline" size="icon" className="h-8 w-8"><Bold className="h-4 w-4"/></Button>
                              <Button type="button" variant="outline" size="icon" className="h-8 w-8"><Italic className="h-4 w-4"/></Button>
                              <Button type="button" variant="outline" size="icon" className="h-8 w-8"><Underline className="h-4 w-4"/></Button>
                              <Button type="button" variant="outline" size="icon" className="h-8 w-8"><Strikethrough className="h-4 w-4"/></Button>
                              <Button type="button" variant="outline" size="icon" className="h-8 w-8"><LinkIcon className="h-4 w-4"/></Button>
                              <Button type="button" variant="outline" size="icon" className="h-8 w-8"><ImageIcon className="h-4 w-4"/></Button>
                              <Button type="button" variant="outline" size="icon" className="h-8 w-8"><List className="h-4 w-4"/></Button>
                              <Button type="button" variant="outline" size="icon" className="h-8 w-8"><ListOrdered className="h-4 w-4"/></Button>
                              <Button type="button" variant="outline" size="icon" className="h-8 w-8"><Code className="h-4 w-4"/></Button>
                              <Button type="button" variant="outline" size="icon" className="h-8 w-8"><Quote className="h-4 w-4"/></Button>
                          </div>
                           <FormControl>
                              <Textarea 
                                  placeholder="Start writing your content here..." 
                                  className="min-h-[400px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-t-none"
                                  {...field}
                              />
                            </FormControl>
                      </div>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>Publish this post</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>Mark as featured</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                <Button type="submit" className="w-full btn-gold" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Create Post
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                       <FormControl>
                          <Input placeholder="e.g., Music Production" {...field} />
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
                      <FormLabel>Tags (comma-separated)</FormLabel>
                       <FormControl>
                          <Input placeholder="e.g., mixing, mastering" {...field} />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                  <CardTitle>Cover Image</CardTitle>
                </CardHeader>
                <CardContent>
                   <FormField
                      control={form.control}
                      name="coverImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                           <FormControl>
                              <Input placeholder="https://..." {...field} />
                           </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                       <FormControl>
                          <Input {...field} />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                       <FormControl>
                          <Textarea rows={3} {...field} />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

          </div>
        </form>
      </Form>
    </motion.div>
  );
}
