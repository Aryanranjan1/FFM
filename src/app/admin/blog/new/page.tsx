
"use client";

import { ArrowLeft, Bold, Italic, Underline, Strikethrough, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Code, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NewBlogPostPage() {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="post-title">Post Title</Label>
                <Input id="post-title" placeholder="Your amazing blog post title" />
              </div>
              <div>
                <Label>Content</Label>
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
                        <Button variant="outline" size="icon" className="h-8 w-8"><Bold className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><Italic className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><Underline className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><Strikethrough className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><LinkIcon className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><ImageIcon className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><List className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><ListOrdered className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><Code className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><Quote className="h-4 w-4"/></Button>
                    </div>
                    <Textarea 
                        placeholder="Start writing your content here..." 
                        className="min-h-[400px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-t-none"
                    />
                </div>
              </div>
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
              <div className="flex items-center space-x-2">
                <Checkbox id="publish-post" />
                <Label htmlFor="publish-post">Publish this post</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mark-featured" />
                <Label htmlFor="mark-featured">Mark as featured</Label>
              </div>
               <Button className="w-full btn-gold">Create Post</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., Music Production" />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" placeholder="e.g., mixing, mastering" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo-title">SEO Title</Label>
                <Input id="seo-title" />
              </div>
              <div>
                <Label htmlFor="seo-description">SEO Description</Label>
                <Textarea id="seo-description" rows={3} />
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
               <div>
                <Label htmlFor="cover-image-url">Image URL</Label>
                <Input id="cover-image-url" placeholder="https://..." />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
