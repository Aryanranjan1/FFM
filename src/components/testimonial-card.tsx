
"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Testimonial {
  title: string;
  publication: string;
  date: string;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    // This code runs only on the client, after hydration
    setFormattedDate(new Date(testimonial.date).toLocaleDateString());
  }, [testimonial.date]);

  return (
    <Card className="bg-background/50 border-border/50 h-full flex flex-col p-6">
      <div className="flex-grow mb-4">
        <p className="text-muted-foreground italic">"{testimonial.title}"</p>
      </div>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-primary fill-current" />
            ))}
          </div>
          <p className="font-bold mt-2">{testimonial.publication}</p>
          {formattedDate ? (
             <p className="text-sm text-muted-foreground">{formattedDate}</p>
          ) : (
            <div className="h-4 bg-muted/50 rounded w-24 mt-1 animate-pulse" />
          )}
        </div>
      </div>
    </Card>
  );
}
