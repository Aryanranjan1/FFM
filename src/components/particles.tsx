"use client";

import { useEffect, useRef } from "react";

export function Particles() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create particles
    if (particlesRef.current) {
      particlesRef.current.innerHTML = '';
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesRef.current.appendChild(particle);
      }
    }
  }, []);

  return (
    <div className="particles-container" ref={particlesRef}></div>
  );
}
