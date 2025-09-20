
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsManagementPage() {
  return (
    <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-headline font-bold text-primary">TESTIMONIALS</h2>
        <Button className="btn-gold">
          <Plus className="mr-2 h-4 w-4" />
          Add New Testimonial
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead>Publication</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No testimonials found.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
