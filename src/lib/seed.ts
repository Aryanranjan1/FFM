
import { db } from './firebase';
import { collection, addDoc, Timestamp, getDocs, writeBatch } from 'firebase/firestore';

const blogPosts = [
    {
        category: "Industry Insights",
        title: "The Art of Film Scoring: Creating Emotional Landscapes",
        seoTitle: "The Art of Film Scoring: Creating Emotional Landscapes",
        seoDescription: "Discover the art of film scoring from orchestral dynamics to emotional storytelling techniques that create memorable cinematic experiences.",
        tags: "film scoring, orchestral music, composition, cinematic music, storytelling",
        coverImageUrl: "https://picsum.photos/seed/blog1/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Music Production",
        title: "Home Studio Setup Guide for Orchestral Composers",
        seoTitle: "Home Studio Setup Guide for Orchestral Composers",
        seoDescription: "Complete guide to setting up a professional home studio for orchestral music composition including equipment recommendations and acoustic tips.",
        tags: "home studio, music production, orchestral composition, audio equipment, DAW",
        coverImageUrl: "https://picsum.photos/seed/blog2/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Career Advice",
        title: "5 Essential Tips for Aspiring Film Composers",
        seoTitle: "Essential Tips for Film Composers",
        seoDescription: "Starting a career in film scoring? Here are 5 practical tips to help you succeed, from mastering your tools to building your network.",
        tags: "film scoring, composer, tips, music career, networking",
        coverImageUrl: "https://picsum.photos/seed/blog3/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Music Theory",
        title: "Orchestration Fundamentals for Epic Music Composers",
        seoTitle: "Orchestration Fundamentals for Epic Music",
        seoDescription: "Master the fundamentals of orchestration for epic music composition, including instrument combinations and orchestral arrangement techniques.",
        tags: "orchestration, music theory, epic music, composition, instruments",
        coverImageUrl: "https://picsum.photos/seed/blog4/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Technology",
        title: "Digital Orchestration: How Technology is Changing Music",
        seoTitle: "Digital Orchestration: Modern Tools for Composers",
        seoDescription: "Explore how modern technology and virtual instruments are revolutionizing orchestral music composition and production workflows.",
        tags: "digital orchestration, virtual instruments, sample libraries, music technology, composition",
        coverImageUrl: "https://picsum.photos/seed/blog5/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Creative Process",
        title: "Navigating the Creative Process: From Ideas to Finished Compositions",
        seoTitle: "Overcoming Creative Blocks in Music Composition",
        seoDescription: "Overcome creative blocks and enhance your compositional workflow with proven strategies for maintaining consistent musical creativity.",
        tags: "creative process, composer life, creativity, inspiration, workflow",
        coverImageUrl: "https://picsum.photos/seed/blog6/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Music Business",
        title: "Understanding Music Licensing: A Composer's Guide to Stock Music",
        seoTitle: "Music Licensing Guide for Independent Composers",
        seoDescription: "Learn the fundamentals of music licensing and stock music libraries to monetize your compositions effectively.",
        tags: "music licensing, stock music, royalty-free, music business, composer income",
        coverImageUrl: "https://picsum.photos/seed/blog7/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Cultural Heritage",
        title: "Blending Tradition with Innovation: Gamelan in Modern Composition",
        seoTitle: "Gamelan Influence in Modern Orchestral Music",
        seoDescription: "Discover how traditional gamelan music can inspire and enhance modern orchestral compositions with unique timbres and rhythmic structures.",
        tags: "gamelan, traditional music, world music, cultural fusion, orchestral music",
        coverImageUrl: "https://picsum.photos/seed/blog8/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Performance",
        title: "From Studio to Stage: Working with Live Orchestras",
        seoTitle: "Working with Live Orchestras: A Composer's Guide",
        seoDescription: "Essential tips for composers working with live orchestras, from score preparation to rehearsal etiquette and performance considerations.",
        tags: "live orchestra, performance, score writing, rehearsal, classical music",
        coverImageUrl: "https://picsum.photos/seed/blog9/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Genre Analysis",
        title: "The Evolution of Epic Music: From Classical to Cinematic",
        seoTitle: "Understanding Epic Music: Genre Evolution and Characteristics",
        seoDescription: "Explore the evolution and key characteristics of epic orchestral music, from classical influences to modern trailer music conventions.",
        tags: "epic music, orchestral music, trailer music, genre analysis, film music",
        coverImageUrl: "https://picsum.photos/seed/blog10/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Collaboration",
        title: "The Art of Musical Collaboration: Building Successful Creative Partnerships",
        seoTitle: "Collaborative Composition: Working Successfully with Others",
        seoDescription: "Master the art of musical collaboration with practical tips for working effectively with directors, producers, and fellow musicians.",
        tags: "collaboration, teamwork, music industry, communication, professional skills",
        coverImageUrl: "https://picsum.photos/seed/blog11/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Education",
        title: "Continuing Education for Composers: Resources and Strategies",
        seoTitle: "Lifelong Learning for Composers: Staying Sharp and Current",
        seoDescription: "Discover effective strategies for continuing your musical education and staying current with industry trends and composition techniques.",
        tags: "music education, learning, composer development, skill building, music courses",
        coverImageUrl: "https://picsum.photos/seed/blog12/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Mental Health",
        title: "Maintaining Mental Health as a Professional Composer",
        seoTitle: "Mental Health for Composers: Thriving in Creative Work",
        seoDescription: "Essential mental health strategies for composers dealing with creative pressures, irregular income, and the challenges of artistic life.",
        tags: "mental health, composer life, creativity, wellness, work-life balance",
        coverImageUrl: "https://picsum.photos/seed/blog13/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Inspiration",
        title: "Sources of Musical Inspiration: Finding Your Creative Voice",
        seoTitle: "Finding Musical Inspiration: Beyond the Notes",
        seoDescription: "Explore diverse sources of musical inspiration and learn techniques for translating life experiences into compelling compositions.",
        tags: "inspiration, creativity, composition, artistic development, musical ideas",
        coverImageUrl: "https://picsum.photos/seed/blog14/1200/675",
        isFeatured: false,
        isPublished: true,
    },
    {
        category: "Future Trends",
        title: "The Future of Music Composition: Technology, Trends, and Opportunities",
        seoTitle: "Future of Music Composition: Trends and Technologies",
        seoDescription: "Discover emerging trends in music composition technology, industry changes, and how composers can adapt to the evolving musical landscape.",
        tags: "future trends, music technology, AI music, industry changes, innovation",
        coverImageUrl: "https://picsum.photos/seed/blog15/1200/675",
        isFeatured: false,
        isPublished: true,
    },
].map(post => ({...post, content: post.seoDescription, createdAt: new Date('2025-09-20T10:30:21Z') }));


const testimonials = [
    { author: 'Diane Allen', quote: 'Fahmie\'s compositions are pure magic. He has an incredible talent for weaving emotion into every note.', publication: 'Violin Virtuoso' },
    { author: 'Ahmad Zahir', quote: 'Working with Fahmie on the Gamelan project was a revelation. His modern take on traditional music is groundbreaking.', publication: 'GEMAWAN KISAS' },
    { author: 'Indie Game Dev', quote: 'The score Fahmie created for our game was perfect. It elevated the entire experience.', publication: 'PixelHeart Studios' },
];

const socialLinks = [
    { platform: 'YouTube', url: 'https://www.youtube.com/@FahmieFarhanMusic' },
    { platform: 'SoundCloud', url: 'https://soundcloud.com/fahmiefarhanmusic' },
    { platform: 'Instagram', url: 'https://www.instagram.com/fahmiefarhanmusic' },
    { platform: 'Website', url: 'https://www.fahmiefarhanmusic.com' },
    { platform: 'Pond5', url: 'https://www.pond5.com/artist/fforchestral' },
];

const videos = [
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/d17545adbf9/hqdefault.jpg', title: 'Epic Heroic Motivational Music - OPERATION APEX by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=d17545adbf9' },
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/eed0fa5d081/hqdefault.jpg', title: 'Epic Motivational Music - Heart Of A Warrior by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=eed0fa5d081' },
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/3436cf131f5/hqdefault.jpg', title: 'EPIC MOTIVATIONAL MUSIC - Lone Wolf Resolve by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=3436cf131f5' },
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/vTmzISgwbFk/hqdefault.jpg', title: 'Epic Emotional Music - EVERLASTING STRUGGLE by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=vTmzISgwbFk' },
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/2864e731a00/hqdefault.jpg', title: 'Epic Action Music - COURAGE UNDER FIRE by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=2864e731a00' },
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/3e5e11470de/hqdefault.jpg', title: 'Epic Dark Arabic Music - HASHASHIN by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=3e5e11470de' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/d17545adbf9/hqdefault.jpg', title: 'Epic Heroic Motivational Music - VERGE OF VICTORY by Fahmie Farhan Ariffin', videoUrl: 'https://www.youtube.com/watch?v=d17545adbf9' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/f9d44bfba61/hqdefault.jpg', title: 'Sad Emotional Music - UNTIL WE MEET AGAIN by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=f9d44bfba61' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/d17545adbf9/hqdefault.jpg', title: 'Epic Heroic Motivational Music - THE COURAGE WITHIN by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=d17545adbf9' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/dDMkp9DWCEs/hqdefault.jpg', title: 'Epic Motivational Music - CONTINUE TO FIGHT by Fahmie Farhan Ariffin', videoUrl: 'https://www.youtube.com/watch?v=dDMkp9DWCEs' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/cb287ec5acd/hqdefault.jpg', title: 'Epic Uplifting Emotional Music - UNYIELDING SPIRIT by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=cb287ec5acd' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/be7f2eadc2d/hqdefault.jpg', title: 'EPIC SCI-FI BATTLE MUSIC - Battlefronts Beyond Time by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=be7f2eadc2d' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/d17545adbf9/hqdefault.jpg', title: 'Epic Heroic Music - THROUGH BLOOD AND SACRIFICE by Fahmie Farhan Ariffin', videoUrl: 'https://www.youtube.com/watch?v=d17545adbf9' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/nnjgGg3lRpE/hqdefault.jpg', title: 'Epic Heroic Music - THROUGH PAIN AND SUFFERING by Fahmie Farhan Ariffin', videoUrl: 'https://www.youtube.com/watch?v=nnjgGg3lRpE' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/d3e6043c7d3/hqdefault.jpg', title: 'EPIC EMOTIONAL MUSIC - The Solitary Journey by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=d3e6043c7d3' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/2864e731a00/hqdefault.jpg', title: 'Epic Action Music - THE LAST STAND', videoUrl: 'https://www.youtube.com/watch?v=2864e731a00' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/6584107d003/hqdefault.jpg', title: 'Romantic Emotional Music - UNDER THE MOONLIGHT by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=6584107d003' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/1ac3f56d0f6/hqdefault.jpg', title: 'Epic Adventure Music - The End of Journey by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=1ac3f56d0f6' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/JhYP3ijwdRU/hqdefault.jpg', title: 'Epic Heroic Music - POWERED UP', videoUrl: 'https://www.youtube.com/watch?v=JhYP3ijwdRU' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/4ba8806769f/hqdefault.jpg', title: 'Epic Emotional Music - FRAGMENTS OF RESOLVE', videoUrl: 'https://www.youtube.com/watch?v=4ba8806769f' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/5cc6725a5fa/hqdefault.jpg', title: 'INVINCIBLE - Epic Heroic Motivational Music', videoUrl: 'https://www.youtube.com/watch?v=5cc6725a5fa' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/_jsKkEolMnQ/hqdefault.jpg', title: 'Epic Heroic Music - INTO THE MARTYRDOM', videoUrl: 'https://www.youtube.com/watch?v=_jsKkEolMnQ' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/11a781d1cc3/hqdefault.jpg', title: 'THE SUCCESSOR - Epic Emotional Music', videoUrl: 'https://www.youtube.com/watch?v=11a781d1cc3' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/3e5e11470de/hqdefault.jpg', title: 'Epic Dark Emotional Music - TRAGIC VENGEANCE by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=3e5e11470de' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/4d6b72cb5b7/hqdefault.jpg', title: 'Intense background music that plays during chasing scene in Middle East', videoUrl: 'https://www.youtube.com/watch?v=4d6b72cb5b7' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/3963049b60d/hqdefault.jpg', title: 'STRENGTH TO ENDURE - Epic Intense Action Music', videoUrl: 'https://www.youtube.com/watch?v=3963049b60d' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/efb3a901b86/hqdefault.jpg', title: 'Resilience Beyond Breaks (Epic Emotional Music)', videoUrl: 'https://www.youtube.com/watch?v=efb3a901b86' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/a6e626dd447/hqdefault.jpg', title: 'EPIC ADVENTURE MUSIC - Sunrise Symphony by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=a6e626dd447' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/1ad56515bd8/hqdefault.jpg', title: 'EPIC PIRATE ADVENTURE MUSIC - Journey Across The Waves by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=1ad56515bd8' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/1ac3f56d0f6/hqdefault.jpg', title: 'Epic Adventure Music - NEW ADVENTURE BEGINS by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=1ac3f56d0f6' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/0461a5fd3a1/hqdefault.jpg', title: 'Never Surrender (Cinematic Corporate Music)', videoUrl: 'https://www.youtube.com/watch?v=0461a5fd3a1' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/07477ba2c6c/hqdefault.jpg', title: 'Assault On Shadows (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=07477ba2c6c' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/eb1c6183e82/hqdefault.jpg', title: 'Tears Of The Brave (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=eb1c6183e82' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/9a7d2ae846b/hqdefault.jpg', title: 'In The Line Of Duty (Epic Action Music)', videoUrl: 'https://www.youtube.com/watch?v=9a7d2ae846b' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/6P-mmkb_6oo/hqdefault.jpg', title: 'SANDS OF MARTYRDOM - Epic Arabic Music', videoUrl: 'https://www.youtube.com/watch?v=6P-mmkb_6oo' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/85dbXlGyDP8/hqdefault.jpg', title: 'Shimmering Destiny (Epic Adventure Music)', videoUrl: 'https://www.youtube.com/watch?v=85dbXlGyDP8' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/c53a123a508/hqdefault.jpg', title: 'Determination Of A Hero (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=c53a123a508' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/e693cb41811/hqdefault.jpg', title: 'THANK YOU FOR 500 SUBSCRIBERS!', videoUrl: 'https://www.youtube.com/watch?v=e693cb41811' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/89b82434e65/hqdefault.jpg', title: 'Flying To The Sky (Epic Adventure Music)', videoUrl: 'https://www.youtube.com/watch?v=89b82434e65' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/95d83e986c6/hqdefault.jpg', title: 'Together Towards Victory (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=95d83e986c6' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/5b3b8c73a52/hqdefault.jpg', title: 'Shattered Yet Standing (Epic Emotional Music)', videoUrl: 'https://www.youtube.com/watch?v=5b3b8c73a52' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/891e07992d8/hqdefault.jpg', title: 'Towards The Horizon (Epic Adventure Music)', videoUrl: 'https://www.youtube.com/watch?v=891e07992d8' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/9ef1f3ac9ce/hqdefault.jpg', title: 'Legacy Of Fortitude (Epic Emotional Music)', videoUrl: 'https://www.youtube.com/watch?v=9ef1f3ac9ce' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/abf41cb00a0/hqdefault.jpg', title: 'Till The Last Breath (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=abf41cb00a0' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/a7f282e8efe/hqdefault.jpg', title: 'The Day I Met You (Epic Emotional Music)', videoUrl: 'https://www.youtube.com/watch?v=a7f282e8efe' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/56260e8cb21/hqdefault.jpg', title: 'Brace Yourself (Epic Action Music)', videoUrl: 'https://www.youtube.com/watch?v=56260e8cb21' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/9cfa7e01aa3/hqdefault.jpg', title: 'Let Us Win This Battle (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=9cfa7e01aa3' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/d4930488f67/hqdefault.jpg', title: 'All As I Want (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=d4930488f67' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/0007f404f8e/hqdefault.jpg', title: 'This Is Not The End (Cinematic Corporate Music)', videoUrl: 'https://www.youtube.com/watch?v=0007f404f8e' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/84f9fd9f0d9/hqdefault.jpg', title: 'The Chosen One (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=84f9fd9f0d9' },
].map((video) => ({
    ...video,
    category: "Orchestral Cover",
    createdAt: new Date('2025-09-20T10:30:21Z'),
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
            createdAt: Timestamp.fromDate(item.createdAt),
        };
        await addDoc(collectionRef, docData);
        console.log(`Added doc to ${collectionName}`);
    }
    console.log(`${collectionName} seeding complete.`);
}


async function main() {
    console.log('Starting database seeding...');
    
    const collectionsToClear = ['blog', 'testimonials', 'social-links', 'videos'];
    for (const collectionName of collectionsToClear) {
        await clearCollection(collectionName);
    }

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
