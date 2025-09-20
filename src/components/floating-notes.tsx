
"use client";

import { useEffect, useRef } from "react";

export function FloatingNotes() {
  const notesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = notesRef.current;
    if (container) {
      container.innerHTML = ''; // Clear existing notes
      const noteChars = ["♪", "♫", "♬", "♩"];
      const numNotes = 10; // Reduced from 20 for a subtler effect

      for (let i = 0; i < numNotes; i++) {
        const note = document.createElement("div");
        note.className = "music-note";
        note.textContent = noteChars[Math.floor(Math.random() * noteChars.length)];
        note.style.left = `${Math.random() * 100}%`;
        note.style.animationDuration = `${Math.random() * 15 + 15}s`;
        note.style.animationDelay = `${Math.random() * 15}s`;
        note.style.fontSize = `${Math.random() * 1.5 + 0.75}rem`;
        note.style.opacity = `${Math.random() * 0.5 + 0.2}`;
        container.appendChild(note);
      }
    }
  }, []);

  return <div ref={notesRef} className="floating-notes" />;
}
