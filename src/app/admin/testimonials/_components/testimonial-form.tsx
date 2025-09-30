
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addTestimonial, type TestimonialFormValues, updateTestimonial } from "@/app/actions";
import type { Testimonial } from "@/lib/admin-types";

import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";

const testimonialSchema = z.object({
  author: z.string().min(2, "Author is required."),
  publication: z.string().min(2, "Publication/Role is required."),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
});

type TestimonialFormProps = {
  testimonial?: Testimonial | null;
};

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      author: testimonial?.author || "",
      publication: testimonial?.publication || "",
      quote: testimonial?.quote || "",
    },
  });

  const pageTitle = testimonial ? "EDIT TESTIMONIAL" : "ADD NEW TESTIMONIAL";
  const actionText = testimonial ? "Save Changes" : "Create Testimonial";

  const onSubmit = async (values: TestimonialFormValues) => {
    setIsSubmitting(true);
    const result = testimonial ? await updateTestimonial(testimonial.id, values) : await addTestimonial(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      router.push('/admin/testimonials');
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
          <Link href="/admin/testimonials">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-headline font-bold text-primary">{pageTitle}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
          <CardDescription>Fill in the information for the testimonial.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="publication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication / Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Music Critic, Synth Magazine" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote</FormLabel>
                    <FormControl>
                        <Textarea placeholder="The testimonial content..." {...field} />
                    </FormControl>
                    <FormMessage />
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
