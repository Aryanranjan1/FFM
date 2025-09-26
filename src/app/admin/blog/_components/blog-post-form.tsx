
"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addBlogPost, updateBlogPost, type BlogPostFormValues } from '@/app/actions';
import type { BlogPost } from '@/lib/admin-types';

import { ArrowLeft, Bold, Italic, Underline, Strikethrough, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Code, Quote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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

type BlogPostFormProps = {
  post?: BlogPost | null;
};

export function BlogPostForm({ post }: BlogPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const selectionRef = useRef<Range | null>(null);


  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      category: post?.category || "",
      tags: post?.tags || "",
      coverImageUrl: post?.coverImageUrl || "",
      seoTitle: post?.seoTitle || "",
      seoDescription: post?.seoDescription || "",
      isPublished: post?.isPublished ?? true,
      isFeatured: post?.isFeatured || false,
    },
  });
  
  const handleContentChange = (event: React.FormEvent<HTMLDivElement>) => {
    const content = event.currentTarget.innerHTML;
    form.setValue('content', content, { shouldValidate: true });
  };
  
  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest('a');
    if (target && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      window.open(target.href, '_blank');
    }
  };
  
  useEffect(() => {
    if (contentRef.current && post?.content && contentRef.current.innerHTML !== post.content) {
      contentRef.current.innerHTML = post.content;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);
  
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selectionRef.current = selection.getRangeAt(0).cloneRange();
    } else {
      selectionRef.current = null;
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (selection && selectionRef.current) {
      selection.removeAllRanges();
      selection.addRange(selectionRef.current);
    }
  };

  const execCommand = (command: string, value?: string) => {
    contentRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    if(contentRef.current) {
        form.setValue('content', contentRef.current.innerHTML, { shouldValidate: true });
    }
  };

  const openLinkModal = () => {
    saveSelection();
    const selection = window.getSelection();
    setLinkText(selection ? selection.toString() : '');
    setIsLinkModalOpen(true);
  };
  
  const handleLinkInsert = () => {
    restoreSelection();
    contentRef.current?.focus();
    
    if (selectionRef.current && selectionRef.current.toString().length === 0) {
        const linkHtml = `<a href="${linkUrl}" target="_blank">${linkText || linkUrl}</a>`;
        execCommand('insertHTML', linkHtml);
    } else {
        execCommand('createLink', linkUrl);
    }

    setIsLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
  };

  const openImageModal = () => {
    saveSelection();
    setIsImageModalOpen(true);
  };
  
  const handleImageInsert = () => {
    restoreSelection();
    contentRef.current?.focus();
    if (imageUrl) {
        execCommand('insertImage', imageUrl);
    }
    setIsImageModalOpen(false);
    setImageUrl('');
  };
  
  const openEmbedModal = () => {
    saveSelection();
    setIsEmbedModalOpen(true);
  };

  const handleEmbedInsert = () => {
    restoreSelection();
    contentRef.current?.focus();
    if (embedCode) {
      execCommand('insertHTML', embedCode);
    }
    setIsEmbedModalOpen(false);
    setEmbedCode('');
  };

  const applyFontSize = (sizeClass: string) => {
    saveSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.toString()) {
        toast({ title: "Selection needed", description: "Please select text to change its size.", variant: "destructive"})
        return;
    }
    
    restoreSelection();
    contentRef.current?.focus();
    const span = `<span class="${sizeClass}">${selection.toString()}</span>`;
    execCommand('insertHTML', span);
  };

  const pageTitle = post ? "EDIT BLOG POST" : "CREATE NEW BLOG POST";
  const actionText = post ? "Save Changes" : "Create Post";

  const onSubmit = async (values: BlogPostFormValues) => {
    setIsSubmitting(true);
    const result = post
      ? await updateBlogPost(post.id, values)
      : await addBlogPost(values);
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
        <h2 className="text-3xl font-headline font-bold text-primary">{pageTitle}</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

                <div className="space-y-2">
                  <FormLabel>Content</FormLabel>
                   <div className="rounded-md border border-input">
                       <div className="p-2 border-b border-input flex items-center flex-wrap gap-1">
                           <Select onValueChange={(value) => execCommand('formatBlock', value)} defaultValue="p">
                               <SelectTrigger className="w-[120px] h-8">
                                   <SelectValue placeholder="Format" />
                               </SelectTrigger>
                               <SelectContent>
                                   <SelectItem value="p">Normal</SelectItem>
                                   <SelectItem value="h1">Heading 1</SelectItem>
                                   <SelectItem value="h2">Heading 2</SelectItem>
                                   <SelectItem value="blockquote">Quote</SelectItem>
                                   <SelectItem value="pre">Code</SelectItem>
                               </SelectContent>
                           </Select>
                           <Select onValueChange={applyFontSize} defaultValue="text-base">
                               <SelectTrigger className="w-[100px] h-8">
                                   <SelectValue placeholder="Font Size" />
                               </SelectTrigger>
                               <SelectContent>
                                   <SelectItem value="text-sm">Small</SelectItem>
                                   <SelectItem value="text-base">Medium</SelectItem>
                                   <SelectItem value="text-2xl">Large</SelectItem>
                               </SelectContent>
                           </Select>
                           <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCommand('bold')}><Bold className="h-4 w-4"/></Button>
                           <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCommand('italic')}><Italic className="h-4 w-4"/></Button>
                           <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCommand('underline')}><Underline className="h-4 w-4"/></Button>
                           <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCommand('strikeThrough')}><Strikethrough className="h-4 w-4"/></Button>
                           <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={openLinkModal}><LinkIcon className="h-4 w-4"/></Button>
                           <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCommand('insertUnorderedList')}><List className="h-4 w-4"/></Button>
                           <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCommand('insertOrderedList')}><ListOrdered className="h-4 w-4"/></Button>
                           <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={openEmbedModal}><Code className="h-4 w-4"/></Button>
                           <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCommand('formatBlock', 'blockquote')}><Quote className="h-4 w-4"/></Button>
                           <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={openImageModal}><ImageIcon className="h-4 w-4"/></Button>
                       </div>
                        <div
                          ref={contentRef}
                          contentEditable
                          dir="ltr"
                          style={{ direction: 'ltr', textAlign: 'left' }}
                          onInput={handleContentChange}
                          onBlur={saveSelection}
                          onClick={handleContentClick}
                          className="min-h-[400px] p-4 focus:outline-none"
                        />
                   </div>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                   {actionText}
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
                <CardDescription>
                  Optional SEO settings for this post.
                </CardDescription>
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
                          <Input rows={3} {...field} />
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
      
      {/* Link Modal */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="link-url">URL</Label>
                    <Input id="link-url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="link-text">Text</Label>
                    <Input id="link-text" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Text to display" />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>Cancel</Button>
                <Button onClick={handleLinkInsert}>Insert Link</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input id="image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsImageModalOpen(false)}>Cancel</Button>
                <Button onClick={handleImageInsert}>Insert Image</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Embed Modal */}
      <Dialog open={isEmbedModalOpen} onOpenChange={setIsEmbedModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Embed Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="embed-code">Embed Code</Label>
                <Textarea 
                    id="embed-code" 
                    value={embedCode} 
                    onChange={(e) => setEmbedCode(e.target.value)} 
                    placeholder="Paste your HTML embed code here"
                    rows={5}
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsEmbedModalOpen(false)}>Cancel</Button>
                <Button onClick={handleEmbedInsert}>Embed Content</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
}
