"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Video, Newspaper, Users, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { title: "Total Music Tracks", value: "0", icon: Music },
  { title: "YouTube Videos", value: "0", icon: Video },
  { title: "Blog Posts", value: "0", icon: Newspaper },
  { title: "Social Links", value: "0", icon: LinkIcon },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function AdminDashboardPage() {
  return (
    <motion.div 
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Music Tracks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No music tracks found.</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Contact Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No contact submissions found.</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
