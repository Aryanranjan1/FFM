
"use client";

import { useEffect, useState } from "react";
import type { ContactSubmission } from "@/lib/admin-types";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { format } from 'date-fns';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";

export default function ContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const submissionsData: ContactSubmission[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        submissionsData.push({
          id: doc.id,
          ...data,
          submittedAt: (data.submittedAt as any)?.toDate ? (data.submittedAt as any).toDate().toISOString() : new Date().toISOString(),
        } as ContactSubmission);
      });
      setSubmissions(submissionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-headline font-bold text-primary">CONTACT SUBMISSIONS</h2>
            <p className="text-muted-foreground">Messages from your website contact form.</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : submissions.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
               {submissions.map((submission, index) => (
                    <AccordionItem value={`item-${index}`} key={submission.id}>
                        <AccordionTrigger>
                            <div className="flex justify-between items-center w-full pr-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 font-semibold">
                                        <User className="h-4 w-4 text-primary" />
                                        <span>{submission.name}</span>
                                    </div>
                                    <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                                         <Mail className="h-4 w-4" />
                                        <span>{submission.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground hidden lg:block truncate max-w-xs">
                                        {submission.subject || 'No Subject'}
                                    </span>
                                     <Badge variant={index < 3 ? "default" : "secondary"}>
                                        {index < 3 ? 'New' : 'Read'}
                                    </Badge>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <Card className="bg-background/50 m-2">
                                <CardHeader>
                                    <CardTitle className="text-lg">{submission.subject || 'No Subject'}</CardTitle>
                                    <CardDescription className="flex flex-col sm:flex-row sm:gap-4 text-xs">
                                        <span>From: {submission.name} &lt;{submission.email}&gt;</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> {format(new Date(submission.submittedAt), "PPP p")}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{submission.message}</p>
                                </CardContent>
                           </Card>
                        </AccordionContent>
                    </AccordionItem>
               ))}
            </Accordion>
          ) : (
            <div className="text-center h-24 flex items-center justify-center text-muted-foreground">
                No contact submissions yet.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
