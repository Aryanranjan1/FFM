
import { db } from './firebase';
import { collection, addDoc, Timestamp, getDocs, writeBatch } from 'firebase/firestore';

const blogPosts = [
    {
      title: "The Art of Orchestral Hybrid Music: A Deep Dive",
      content: "Orchestral hybrid music has become a dominant force in modern film, television, and game soundtracks. But what exactly is it? At its core, it's a fusion of traditional orchestral elements—strings, brass, woodwinds, and percussion—with modern electronic production techniques. This can include synthesizers, electronic drum machines, sound design, and digital effects...\n\nThis genre allows composers to create vast, epic soundscapes that would be impossible with an orchestra alone. The electronic elements can add a layer of grit, power, or otherworldly texture that elevates the emotional impact. Think of the thunderous percussion in a blockbuster action scene or the subtle, atmospheric pads in a sci-fi thriller. That's the power of the hybrid approach.",
      category: "Composition",
      tags: "orchestral, hybrid, film scoring, music production",
      coverImageUrl: "https://picsum.photos/seed/blog1/1200/675",
      isPublished: true,
      isFeatured: true,
      seoTitle: "A Guide to Orchestral Hybrid Music",
      seoDescription: "Explore the fusion of orchestral and electronic music. Learn what makes orchestral hybrid music so powerful in modern soundtracks.",
    },
    {
      title: "Preserving Heritage: The Modern Sound of Malay Gamelan",
      content: "The gamelan is a traditional ensemble from Indonesia and Malaysia, rich with history and cultural significance. For centuries, its hypnotic, percussive sound has been the heartbeat of ceremonies and storytelling. But how does this ancient tradition fit into the 21st century? As a composer, I'm passionate about not just preserving this heritage, but helping it evolve...\n\nBy introducing modern compositional ideas, harmonies, and even integrating it with Western instruments or electronic soundscapes, we can create something new and exciting. It's a delicate balance of respecting the tradition while pushing its boundaries. This approach introduces gamelan to a new generation and a global audience, ensuring its beautiful sound continues to resonate for centuries to come.",
      category: "Cultural Heritage",
      tags: "gamelan, malay music, world music, cultural preservation",
      coverImageUrl: "https://picsum.photos/seed/blog2/1200/675",
      isPublished: true,
      isFeatured: true,
      seoTitle: "The Evolution of Malay Gamelan Music",
      seoDescription: "Discover how traditional Malay gamelan is being fused with modern composition to create a sound that honors the past while looking to the future.",
    },
    {
        title: "5 Essential Tips for Aspiring Film Composers",
        content: "Breaking into the world of film scoring can be daunting. It's a competitive field, but with the right skills and mindset, you can carve out a path for yourself. Here are five essential tips that have helped me on my journey:\n\n1. Master Your Tools: Know your DAW inside and out. Be proficient with sample libraries and virtual instruments.\n2. Study Film: It's not just about music. Understand storytelling, pacing, and editing. A great score serves the film.\n3. Build a Network: Connect with filmmakers, directors, and editors. Your next gig often comes from who you know.\n4. Develop Your Voice: What makes your music unique? Cultivate a signature style that sets you apart.\n5. Be Professional: Meet deadlines, communicate clearly, and be open to feedback. A good attitude is as important as good music.",
        category: "Industry Insights",
        tags: "film scoring, composer, tips, music career, networking",
        coverImageUrl: "https://picsum.photos/seed/blog3/1200/675",
        isPublished: true,
        isFeatured: false,
        seoTitle: "Essential Tips for Film Composers",
        seoDescription: "Starting a career in film scoring? Here are 5 practical tips to help you succeed, from mastering your tools to building your network.",
    },
    {
        title: "Behind the Scenes: Scoring a High-Energy Battle Sequence",
        content: "Scoring a battle sequence is a composer's playground. It's all about energy, tension, and release. My process usually starts with the percussion. It’s the foundation of the track, driving the action forward. I layer different drum kits, from epic orchestral taikos to punchy electronic kicks, to create a massive wall of sound.\n\nNext come the strings. Fast-paced, aggressive string ostinatos (short, repeated patterns) create a sense of urgency and chaos. I'll often double these with a gritty synth bass to add weight and power. Finally, the brass section provides the heroic or terrifying melodies that define the emotional core of the scene. It's a complex puzzle, but when all the pieces fit together, it's an incredibly rewarding process.",
        category: "Behind the Scenes",
        tags: "film scoring, action music, composition, orchestraton, behind the scenes",
        coverImageUrl: "https://picsum.photos/seed/blog4/1200/675",
        isPublished: true,
        isFeatured: false,
        seoTitle: "How to Score an Epic Battle Scene",
        seoDescription: "A behind-the-scenes look at the process of composing music for a high-energy action or battle sequence in a film or game.",
    },
    {
        title: "The Business of Music: Licensing Your Work on Stock Platforms",
        content: "For many composers, music licensing is a vital income stream. Platforms like AudioJungle, Pond5, and Artlist allow you to sell licenses for your music to a global market of filmmakers, YouTubers, and content creators. But success requires more than just writing good music.\n\nYou need to think like a marketer. Use clear, descriptive titles and tags. 'Epic Cinematic Trailer' is more likely to be found than 'Symphony No. 5'. Produce high-quality, well-mixed tracks. And be consistent. The more music you have in your portfolio, the more chances you have of making a sale. It's a numbers game, but it can be a rewarding way to earn a living from your passion.",
        category: "Business",
        tags: "music licensing, stock music, music business, composer career",
        coverImageUrl: "https://picsum.photos/seed/blog5/1200/675",
        isPublished: true,
        isFeatured: false,
        seoTitle: "A Composer's Guide to Music Licensing",
        seoDescription: "Learn how to successfully license your music on stock music platforms and build a sustainable income stream as a composer.",
    },
    {
        title: "From Inspiration to Final Track: My Composition Workflow",
        content: "Every track starts with a spark of inspiration. For me, that often comes from a visual—a piece of concept art, a scene from a film, or even just a color palette. I'll sit at the piano and sketch out a simple melody or chord progression that captures that initial feeling.\n\nFrom there, I move to my DAW (Digital Audio Workstation). I start building the arrangement, usually beginning with the core instruments that define the track's character. It's a process of layering, tweaking, and refining. I'll spend hours on sound selection, mixing, and mastering to ensure every element sits perfectly in the mix. The final step is often walking away for a day and coming back with fresh ears for one last listen before calling it finished.",
        category: "Composition",
        tags: "composition, workflow, music production, creativity, inspiration",
        coverImageUrl: "https://picsum.photos/seed/blog6/1200/675",
        isPublished: true,
        isFeatured: false,
        seoTitle: "My Music Composition Workflow",
        seoDescription: "A step-by-step look into my creative process, from the initial spark of inspiration to the final mastered track.",
    },
    {
        title: "The Power of a Great Melody",
        content: "In a world of complex productions and sound design, we sometimes forget the power of a simple, memorable melody. A great melody is the heart of a piece of music. It's what the listener hums after the track is over. It's what conveys the core emotion of a scene.\n\nWhat makes a melody great? It's a combination of contour, rhythm, and harmony. It should have a clear shape, an interesting rhythm, and be supported by chords that enhance its emotional impact. Whether it's a soaring heroic theme or a simple, melancholic piano line, a strong melody will always be the most powerful tool in a composer's arsenal.",
        category: "Composition",
        tags: "melody, songwriting, music theory, composition",
        coverImageUrl: "https://picsum.photos/seed/blog7/1200/675",
        isPublished: true,
        isFeatured: false,
        seoTitle: "Why a Great Melody is Key in Music",
        seoDescription: "An exploration of what makes a melody memorable and emotionally powerful, and why it remains the most important element of music.",
    },
    {
        title: "Gamelan 101: An Introduction to the Instruments",
        content: "The Malay Gamelan ensemble is a treasure trove of unique, beautiful sounds. The core of the ensemble is a collection of knobbed gongs. The 'gong agung' is the largest, marking the beginning and end of musical phrases. Smaller hanging gongs like the 'kenong' and 'kempul' provide punctuation.\n\nThe melodic heart is often carried by the 'saron' and 'gambang'—metallophones and xylophones that play the main theme. The 'bonang' is a set of pot-gongs that elaborates on the melody. Together, these instruments create a rich, interlocking tapestry of sound that is unlike anything else in the world. Exploring these sounds is a journey into a deep and beautiful musical tradition.",
        category: "Cultural Heritage",
        tags: "gamelan, world music, instruments, malaysian culture, ethnomusicology",
        coverImageUrl: "https://picsum.photos/seed/blog8/1200/675",
        isPublished: true,
        isFeatured: false,
        seoTitle: "A Beginner's Guide to Gamelan Instruments",
        seoDescription: "Learn about the core instruments of the Malay Gamelan ensemble, from the mighty gong agung to the melodic saron.",
    },
    {
        title: "Collaboration in Composition: Working with Diane Allen",
        content: "Collaboration is one of the most rewarding aspects of being a musician. My work with the incredible violin virtuoso Diane Allen is a perfect example. Diane is a master of her instrument, capable of conveying immense power and subtle emotion in equal measure. Our collaboration is a true partnership.\n\nI'll send her a compositional sketch, and she'll record her violin part, often adding her own improvisations and ideas that elevate the track to a new level. We'll go back and forth, refining the arrangement until it's perfect. This fusion of my orchestral production with her live, virtuosic performance creates a sound that neither of us could achieve alone. It’s a testament to the power of creative partnership.",
        category: "Collaboration",
        tags: "collaboration, diane allen, violin, orchestral music, composition",
        coverImageUrl: "https://picsum.photos/seed/blog9/1200/675",
        isPublished: true,
        isFeatured: false,
        seoTitle: "The Art of Musical Collaboration with Diane Allen",
        seoDescription: "A look into the collaborative process between composer Fahmie Farhan and violin virtuoso Diane Allen.",
    },
    {
        title: "The Future of Music: AI in Composition",
        content: "Artificial intelligence is changing every creative field, and music is no exception. From AI-powered virtual instruments to generative tools that can create entire compositions, the possibilities are endless. Does this mean human composers will become obsolete? I don't think so.\n\nI see AI as a powerful new tool, not a replacement. It can be a co-creator, a source of inspiration when you're stuck, or an assistant to handle tedious tasks. It can generate ideas that a human might never think of. The future of music isn't about human vs. machine; it's about human and machine working together to create sounds we can't even imagine yet. It's an exciting time to be a composer.",
        category: "Technology",
        tags: "ai music, music technology, future of music, artificial intelligence, composition",
        coverImageUrl: "https://picsum.photos/seed/blog10/1200/675",
        isPublished: true,
        isFeatured: false,
        seoTitle: "How AI is Shaping the Future of Music Composition",
        seoDescription: "An exploration of the role of artificial intelligence in music, and how composers can use it as a powerful collaborative tool.",
    },
];

const testimonials = [
    { author: 'Diane Allen', quote: 'Fahmie\'s compositions are pure magic. He has an incredible talent for weaving emotion into every note.', publication: 'Violin Virtuoso' },
    { author: 'Ahmad Zahir', quote: 'Working with Fahmie on the Gamelan project was a revelation. His modern take on traditional music is groundbreaking.', publication: 'GEMAWAN KISAS' },
    { author: 'Indie Game Dev', quote: 'The score Fahmie created for our game was perfect. It elevated the entire experience.', publication: 'PixelHeart Studios' },
];

const socialLinks = [
    { platform: 'YouTube', url: 'https://www.youtube.com' },
    { platform: 'SoundCloud', url: 'https://soundcloud.com' },
    { platform: 'Instagram', url: 'https://www.instagram.com' },
];

const videos = [
    { title: 'Attack on Titan S4 - "Ashes on The Fire" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=hXh3-G3j_2Y', thumbnailUrl: 'https://img.youtube.com/vi/hXh3-G3j_2Y/hqdefault.jpg' },
    { title: 'NieR:Automata - "Weight of the World" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=5z62_y1k_pI', thumbnailUrl: 'https://img.youtube.com/vi/5z62_y1k_pI/hqdefault.jpg' },
    { title: 'Genshin Impact - "Rex Incognito" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=VyBhzg-f6wA', thumbnailUrl: 'https://img.youtube.com/vi/VyBhzg-f6wA/hqdefault.jpg' },
    { title: 'Demon Slayer - "Gurenge" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=D-v8k8gZ_q8', thumbnailUrl: 'https://img.youtube.com/vi/D-v8k8gZ_q8/hqdefault.jpg' },
    { title: 'Kingdom Hearts - "Dearly Beloved" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=fXb9-bXhH5I', thumbnailUrl: 'https://img.youtube.com/vi/fXb9-bXhH5I/hqdefault.jpg' },
    { title: 'Final Fantasy VII - "One-Winged Angel" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=2-G8I4S4r_E', thumbnailUrl: 'https://img.youtube.com/vi/2-G8I4S4r_E/hqdefault.jpg' },
    { title: 'The Last of Us - "Main Theme" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=4yO9h41gYyA', thumbnailUrl: 'https://img.youtube.com/vi/4yO9h41gYyA/hqdefault.jpg' },
    { title: 'Attack on Titan S3 - "YouSeeBIGGIRL/T:T" (Fahmie Farhan Cover)', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
    { title: 'My Hero Academia - "You Say Run" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=O-s_5qCg7oU', thumbnailUrl: 'https://img.youtube.com/vi/O-s_5qCg7oU/hqdefault.jpg' },
    { title: 'Jujutsu Kaisen - "Kaikai Kitan" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=7u8y7iJ7kE0', thumbnailUrl: 'https://img.youtube.com/vi/7u8y7iJ7kE0/hqdefault.jpg' },
    { title: 'Neon Genesis Evangelion - "A Cruel Angel\'s Thesis" (Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=s1fT4_gB7wQ', thumbnailUrl: 'https://img.youtube.com/vi/s1fT4_gB7wQ/hqdefault.jpg' },
    { title: 'Cyberpunk 2077 - "V" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=aG061_pE7o4', thumbnailUrl: 'https://img.youtube.com/vi/aG061_pE7o4/hqdefault.jpg' },
    { title: 'The Witcher 3 - "Geralt of Rivia" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=6b1pYf26kX8', thumbnailUrl: 'https://img.youtube.com/vi/6b1pYf26kX8/hqdefault.jpg' },
    { title: 'Game of Thrones - "Main Theme" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=p1a_c9g2h4Q', thumbnailUrl: 'https://img.youtube.com/vi/p1a_c9g2h4Q/hqdefault.jpg' },
    { title: 'Interstellar - "Cornfield Chase" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=Q1jZ1x_0L5o', thumbnailUrl: 'https://img.youtube.com/vi/Q1jZ1x_0L5o/hqdefault.jpg' },
    { title: 'Pirates of the Caribbean - "He\'s a Pirate" (Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=j3b_jGg-2-g', thumbnailUrl: 'https://img.youtube.com/vi/j3b_jGg-2-g/hqdefault.jpg' },
    { title: 'Lord of the Rings - "Concerning Hobbits" (Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=y2yY1nL1y_A', thumbnailUrl: 'https://img.youtube.com/vi/y2yY1nL1y_A/hqdefault.jpg' },
    { title: 'Star Wars - "Duel of the Fates" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=k6_b8wz_c-A', thumbnailUrl: 'https://img.youtube.com/vi/k6_b8wz_c-A/hqdefault.jpg' },
    { title: 'Harry Potter - "Hedwig\'s Theme" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=O3u1_qG3_wY', thumbnailUrl: 'https://img.youtube.com/vi/O3u1_qG3_wY/hqdefault.jpg' },
    { title: 'Naruto - "Sadness and Sorrow" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=wE6vQ_9_a-g', thumbnailUrl: 'https://img.youtube.com/vi/wE6vQ_9_a-g/hqdefault.jpg' },
    { title: 'Bleach - "Number One" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=1LSoc4k9qjQ', thumbnailUrl: 'https://img.youtube.com/vi/1LSoc4k9qjQ/hqdefault.jpg' },
    { title: 'Code Geass - "Colors" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=f-2gR_c8HwA', thumbnailUrl: 'https://img.youtube.com/vi/f-2gR_c8HwA/hqdefault.jpg' },
    { title: 'Fullmetal Alchemist - "Again" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=pAd0zF8aQpA', thumbnailUrl: 'https://img.youtube.com/vi/pAd0zF8aQpA/hqdefault.jpg' },
    { title: 'Sword Art Online - "Swordland" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=jZg-aA-1_A', thumbnailUrl: 'https://img.youtube.com/vi/jZg-aA-1_A/hqdefault.jpg' },
    { title: 'Death Note - "The World" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=a-G_a_g-aA', thumbnailUrl: 'https://img.youtube.com/vi/a-G_a_g-aA/hqdefault.jpg' },
    { title: 'Attack on Titan - "Guren no Yumiya" (Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=G_g-aA-1_A', thumbnailUrl: 'https://img.youtube.com/vi/G_g-aA-1_A/hqdefault.jpg' },
    { title: 'Tokyo Ghoul - "Unravel" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=aA-1_a-G_g', thumbnailUrl: 'https://img.youtube.com/vi/aA-1_a-G_g/hqdefault.jpg' },
    { title: 'One Punch Man - "The Hero!!" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=1_a-G_g-aA', thumbnailUrl: 'https://img.youtube.com/vi/1_a-G_g-aA/hqdefault.jpg' },
    { title: 'Re:Zero - "Styx Helix" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=-G_g-aA-1_A', thumbnailUrl: 'https://img.youtube.com/vi/-G_g-aA-1_A/hqdefault.jpg' },
    { title: 'Fate/Zero - "To the Beginning" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=g-aA-1_G_g', thumbnailUrl: 'https://img.youtube.com/vi/g-aA-1_G_g/hqdefault.jpg' },
    { title: 'Genshin Impact - "Liyue" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=aA-1_G_g-aA', thumbnailUrl: 'https://img.youtube.com/vi/aA-1_G_g-aA/hqdefault.jpg' },
    { title: 'Honkai Star Rail - "Wildfire" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=1_G_g-aA-aA', thumbnailUrl: 'https://img.youtube.com/vi/1_G_g-aA-aA/hqdefault.jpg' },
    { title: 'Persona 5 - "Last Surprise" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=G_g-aA-aA-1', thumbnailUrl: 'https://img.youtube.com/vi/G_g-aA-aA-1/hqdefault.jpg' },
    { title: 'Undertale - "Megalovania" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=aA-aA-1_G_g', thumbnailUrl: 'https://img.youtube.com/vi/aA-aA-1_G_g/hqdefault.jpg' },
    { title: 'The Elder Scrolls V: Skyrim - "Dragonborn" (Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=A-1_G_g-aA', thumbnailUrl: 'https://img.youtube.com/vi/A-1_G_g-aA/hqdefault.jpg' },
    { title: 'Halo - "Main Theme" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=-1_G_g-aA-aA', thumbnailUrl: 'https://img.youtube.com/vi/-1_G_g-aA-aA/hqdefault.jpg' },
    { title: 'World of Warcraft - "Invincible" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=_G_g-aA-1_A', thumbnailUrl: 'https://img.youtube.com/vi/_G_g-aA-1_A/hqdefault.jpg' },
    { title: 'Attack on Titan - "Vogel im Käfig" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=g-aA-aA-1_G', thumbnailUrl: 'https://img.youtube.com/vi/g-aA-aA-1_G/hqdefault.jpg' },
    { title: 'Made in Abyss - "Hanezeve Caradhina" (Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=aA-1_g-aA-1', thumbnailUrl: 'https://img.youtube.com/vi/aA-1_g-aA-1/hqdefault.jpg' },
    { title: 'Your Name - "Sparkle" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=1_g-aA-1_G', thumbnailUrl: 'https://img.youtube.com/vi/1_g-aA-1_G/hqdefault.jpg' },
    { title: 'Weathering with You - "Is There Still Anything That Love Can Do?" (Cover)', videoUrl: 'https://www.youtube.com/watch?v=_g-aA-1_G_g', thumbnailUrl: 'https://img.youtube.com/vi/_g-aA-1_G_g/hqdefault.jpg' },
    { title: 'Princess Mononoke - "The Legend of Ashitaka" (Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=aA-1_G_g-aA', thumbnailUrl: 'https://img.youtube.com/vi/aA-1_G_g-aA/hqdefault.jpg' },
    { title: 'Howl\'s Moving Castle - "Merry-Go-Round of Life" (Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=1_G_g-aA-aA', thumbnailUrl: 'https://img.youtube.com/vi/1_G_g-aA-aA/hqdefault.jpg' },
    { title: 'Spirited Away - "One Summer\'s Day" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=G_g-aA-aA-1', thumbnailUrl: 'https://img.youtube.com/vi/G_g-aA-aA-1/hqdefault.jpg' },
    { title: 'Chainsaw Man - "Kick Back" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=aA-aA-1_G_g', thumbnailUrl: 'https://img.youtube.com/vi/aA-aA-1_G_g/hqdefault.jpg' },
    { title: 'Vinland Saga - "Mukanjyo" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=A-1_G_g-aA', thumbnailUrl: 'https://img.youtube.com/vi/A-1_G_g-aA/hqdefault.jpg' },
    { title: 'Blue Lock - "Chaos ga Kiwamaru" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=-1_G_g-aA-aA', thumbnailUrl: 'https://img.youtube.com/vi/-1_G_g-aA-aA/hqdefault.jpg' },
    { title: 'Oshi no Ko - "Idol" (Fahmie Farhan Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=_G_g-aA-1_A', thumbnailUrl: 'https://img.youtube.com/vi/_G_g-aA-1_A/hqdefault.jpg' },
    { title: 'Bocchi the Rock! - "Seishun Complex" (Orchestral Cover)', videoUrl: 'https://www.youtube.com/watch?v=g-aA-aA-1_G', thumbnailUrl: 'https://img.youtube.com/vi/g-aA-aA-1_G/hqdefault.jpg' }
].map((video, index) => ({
    ...video,
    isPublished: true,
    isFeatured: index < 6,
}));

async function clearCollection(collectionName: string) {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
        console.log(`${collectionName} is already empty.`);
        return;
    }
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Cleared ${collectionName} collection.`);
}

async function seedCollection(collectionName: string, data: any[]) {
    const collectionRef = collection(db, collectionName);
    console.log(`Seeding ${collectionName}...`);

    for (const item of data) {
        const docData = {
            ...item,
            createdAt: Timestamp.now(),
        };
        await addDoc(collectionRef, docData);
        console.log(`Added doc to ${collectionName}`);
    }
    console.log(`${collectionName} seeding complete.`);
}


async function main() {
    console.log('Starting database seeding...');
    
    // Clear existing data to prevent duplicates
    await clearCollection('blog');
    await clearCollection('testimonials');
    await clearCollection('social-links');
    await clearCollection('videos');

    // Seed new data
    await seedCollection('blog', blogPosts);
    await seedCollection('testimonials', testimonials);
    await seedCollection('social-links', socialLinks);
    await seedCollection('videos', videos);

    console.log('Database seeding finished successfully!');
}

main().catch(e => {
  console.error('An error occurred during seeding:');
  console.error(e);
  process.exit(1);
});
