
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteCollaboration } from "@/app/actions";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import type { Collaboration as CollaborationType } from "@/lib/admin-types";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Loader2, Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function CollaborationsManagementPage() {
  const [collaborations, setCollaborations] = useState<CollaborationType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "collaborations"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const a: CollaborationType[] = [];
      querySnapshot.forEach((doc) => {
        a.push({ id: doc.id, ...doc.data() } as CollaborationType);
      });
      setCollaborations(a);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await deleteCollaboration(id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-headline font-bold text-primary">COLLABORATIONS</h2>
        <Button asChild className="btn-gold">
            <Link href="/admin/collaborations/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Collaboration
            </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : collaborations.length > 0 ? (
                collaborations.map((c) => (
                  <TableRow key={c.id}>
                     <TableCell>
                        <Image src={c.image} alt={c.name} width={64} height={64} className="rounded-md object-cover" />
                     </TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.role}</TableCell>
                    <TableCell className="max-w-sm truncate">{c.description}</TableCell>
                    <TableCell className="text-right">
                       <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/collaborations/edit/${c.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this collaboration.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(c.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No collaborations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
