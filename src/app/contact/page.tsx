
"use client";

import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, Phone, MapPin, Link as LinkIcon } from "lucide-react";
import { SoundcloudIcon, Youtube, Instagram, SpotifyIcon } from "@/components/icons";
import Link from "next/link";
import { motion } from "framer-motion";
import type { SocialLink as SocialLinkType } from "@/lib/admin-types";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const initialState = {
  message: null,
  errors: {},
};

const iconComponents: { [key: string]: React.FC<any> } = {
    YouTube: (props) => <Youtube {...props} />,
    Instagram: (props) => <Instagram {...props} />,
    Soundcloud: (props) => <SoundcloudIcon {...props} />,
    Spotify: (props) => <SpotifyIcon {...props} />,
    Default: LinkIcon,
};


export default function ContactPage() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();
  const [socialLinks, setSocialLinks] = useState<SocialLinkType[]>([]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const socialLinksQuery = query(collection(db, "social-links"), orderBy("createdAt", "desc"));
        const socialLinksSnapshot = await getDocs(socialLinksQuery);
        const socialLinksData = socialLinksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SocialLinkType[];
        setSocialLinks(socialLinksData);
      } catch (error) {
        console.error("Failed to fetch social links:", error);
      }
    };
    fetchSocialLinks();
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
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
        form.reset();
      }
    }
  }, [state, toast, form]);

  return (
    <div className="bg-transparent text-foreground">
      <div className="relative py-20">
        <div className="hero-bg"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary">Contact</h1>
                <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                    Interested in collaborating on a project or licensing music? I'd love to hear from you!
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-3xl font-bold mb-6 text-primary font-headline">Let's Connect</h3>
                    <p className="text-lg text-muted-foreground mb-8">
                        Whether you're looking for custom compositions, music licensing, or just want to discuss musical ideas, I'm here to help bring your vision to life.
                    </p>
                    <div className="space-y-6 mb-10">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-1">Email</h4>
                                <p className="text-muted-foreground">contact@fahmiefarhan.com</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-1">Phone</h4>
                                <p className="text-muted-foreground">+60 11-31377753</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-1">Location</h4>
                                <p className="text-muted-foreground">Malaysia</p>
                            </div>
                        </div>
                    </div>
                     <div className="mt-10">
                        <h4 className="text-lg font-semibold mb-4">Follow Me</h4>
                        <div className="flex items-center space-x-4">
                           {socialLinks.map((social) => {
                               const Icon = iconComponents[social.platform as keyof typeof iconComponents] || iconComponents.Default;
                               return (
                                   <Link key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                       <Icon className="w-8 h-8" />
                                   </Link>
                               );
                           })}
                        </div>
                    </div>
                </div>
                <div>
                    <Card className="bg-card/80 backdrop-blur-sm border-primary/30">
                      <CardContent className="p-8">
                          <Form {...form}>
                          <form action={formAction} className="space-y-6">
                              <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                      <Input placeholder="Your name" {...field} />
                                  </FormControl>
                                  <FormMessage>{state.errors?.name}</FormMessage>
                                  </FormItem>
                              )}
                              />
                              <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                      <Input placeholder="your@email.com" {...field} />
                                  </FormControl>
                                  <FormMessage>{state.errors?.email}</FormMessage>
                                  </FormItem>
                              )}
                              />
                              <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Subject</FormLabel>
                                  <FormControl>
                                      <Input placeholder="What's this about?" {...field} />
                                  </FormControl>
                                  <FormMessage>{state.errors?.subject}</FormMessage>
                                  </FormItem>
                              )}
                              />
                              <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Message</FormLabel>
                                  <FormControl>
                                      <Textarea placeholder="Your message..." {...field} rows={5} />
                                  </FormControl>
                                  <FormMessage>{state.errors?.message}</FormMessage>
                                  </FormItem>
                              )}
                              />
                              <div className="text-right">
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                  <Button type="submit" size="lg" className="w-full btn-gold px-6 py-3 rounded-md flex items-center justify-center">
                                      <Send className="w-5 h-5 mr-2" />Send Message
                                  </Button>
                              </motion.div>
                              </div>
                          </form>
                          </Form>
                      </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
    </div>
  );
}
