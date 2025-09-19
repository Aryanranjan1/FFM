"use client";

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
  const orbsRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orbsRef.current) {
      orbsRef.current.innerHTML = '';
      for (let i = 0; i < 8; i++) {
        const orb = document.createElement("div");
        orb.className = "orb";
        const size = Math.random() * 100 + 50;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        orb.style.left = `${Math.random() * 90}%`;
        orb.style.top = `${Math.random() * 90}%`;
        orb.style.animationDuration = `${Math.random() * 15 + 10}s`;
        orb.style.animationDelay = `${Math.random() * 5}s`;
        orbsRef.current.appendChild(orb);
      }
    }

    if (notesRef.current) {
      notesRef.current.innerHTML = '';
      const noteChars = ["♪", "♫", "♬", "♩"];
      for (let i = 0; i < 15; i++) {
        const note = document.createElement("div");
        note.className = "music-note";
        note.textContent = noteChars[Math.floor(Math.random() * noteChars.length)];
        note.style.left = `${Math.random() * 100}%`;
        note.style.animationDuration = `${Math.random() * 10 + 20}s`;
        note.style.animationDelay = `${Math.random() * 10}s`;
        notesRef.current.appendChild(note);
      }
    }
  }, []);

  return (
    <div className="relative h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
      <div className="absolute inset-0 floating-orbs" ref={orbsRef}></div>
      <div className="absolute inset-0 floating-notes" ref={notesRef}></div>

      <div className="relative z-10 text-center px-4">
        <motion.h1 
          className="font-headline text-7xl md:text-9xl font-bold tracking-tighter text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          FFM
        </motion.h1>
        <motion.p 
          className="font-body text-xl md:text-2xl mt-4 max-w-2xl mx-auto text-foreground/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Crafting sonic landscapes that transcend boundaries.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button asChild size="lg" className="mt-8 group">
            <Link href="/music">
              Explore Music
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}