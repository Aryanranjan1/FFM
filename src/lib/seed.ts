
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
].map(item => ({ ...item, createdAt: new Date('2025-09-20T10:30:21Z') }));

const socialLinks = [
    { platform: 'YouTube', url: 'https://www.youtube.com/@FahmieFarhanMusic' },
    { platform: 'SoundCloud', url: 'https://soundcloud.com/fahmiefarhanmusic' },
    { platform: 'Instagram', url: 'https://www.instagram.com/fahmiefarhanmusic' },
    { platform: 'Website', url: 'https://www.fahmiefarhanmusic.com' },
    { platform: 'Pond5', url: 'https://www.pond5.com/artist/fforchestral' },
].map(item => ({ ...item, createdAt: new Date('2025-09-20T10:30:21Z') }));

const getYouTubeId = (urlOrId: string): string | null => {
    if (!urlOrId) return null;
    if (urlOrId.length === 11 && !urlOrId.includes('/')) return urlOrId;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const videos = [
    { isFeatured: true, isPublished: true, videoId: 'APEX', title: 'Epic Heroic Motivational Music - OPERATION APEX by FF Orchestral Music' },
    { isFeatured: true, isPublished: true, videoId: 'HeartWarrior', title: 'Epic Motivational Music - Heart Of A Warrior by FF Orchestral Music' },
    { isFeatured: true, isPublished: true, videoId: 'LoneWolf', title: 'EPIC MOTIVATIONAL MUSIC - Lone Wolf Resolve by FF Orchestral Music' },
    { isFeatured: true, isPublished: true, videoId: 'vTmzISgwbFk', title: 'Epic Emotional Music - EVERLASTING STRUGGLE by FF Orchestral Music' },
    { isFeatured: true, isPublished: true, videoId: 'CourageFire', title: 'Epic Action Music - COURAGE UNDER FIRE by FF Orchestral Music' },
    { isFeatured: true, isPublished: true, videoId: 'Hashashin', title: 'Epic Dark Arabic Music - HASHASHIN by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'VergeVictory', title: 'Epic Heroic Motivational Music - VERGE OF VICTORY by Fahmie Farhan Ariffin' },
    { isFeatured: false, isPublished: true, videoId: 'UntilMeet', title: 'Sad Emotional Music - UNTIL WE MEET AGAIN by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'CourageWithin', title: 'Epic Heroic Motivational Music - THE COURAGE WITHIN by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'dDMkp9DWCEs', title: 'Epic Motivational Music - CONTINUE TO FIGHT by Fahmie Farhan Ariffin' },
    { isFeatured: false, isPublished: true, videoId: 'UnyieldingSpirit', title: 'Epic Uplifting Emotional Music - UNYIELDING SPIRIT by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'BattlefrontsBeyond', title: 'EPIC SCI-FI BATTLE MUSIC - Battlefronts Beyond Time by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'BloodSacrifice', title: 'Epic Heroic Music - THROUGH BLOOD AND SACRIFICE by Fahmie Farhan Ariffin' },
    { isFeatured: false, isPublished: true, videoId: 'nnjgGg3lRpE', title: 'Epic Heroic Music - THROUGH PAIN AND SUFFERING by Fahmie Farhan Ariffin' },
    { isFeatured: false, isPublished: true, videoId: 'SolitaryJourney', title: 'EPIC EMOTIONAL MUSIC - The Solitary Journey by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'LastStand', title: 'Epic Action Music - THE LAST STAND' },
    { isFeatured: false, isPublished: true, videoId: 'UnderMoonlight', title: 'Romantic Emotional Music - UNDER THE MOONLIGHT by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'EndJourney', title: 'Epic Adventure Music - The End of Journey by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'JhYP3ijwdRU', title: 'Epic Heroic Music - POWERED UP' },
    { isFeatured: false, isPublished: true, videoId: 'FragmentsResolve', title: 'Epic Emotional Music - FRAGMENTS OF RESOLVE' },
    { isFeatured: false, isPublished: true, videoId: 'Invincible', title: 'INVINCIBLE - Epic Heroic Motivational Music' },
    { isFeatured: false, isPublished: true, videoId: '_jsKkEolMnQ', title: 'Epic Heroic Music - INTO THE MARTYRDOM' },
    { isFeatured: false, isPublished: true, videoId: 'Successor', title: 'THE SUCCESSOR - Epic Emotional Music' },
    { isFeatured: false, isPublished: true, videoId: 'TragicVengeance', title: 'Epic Dark Emotional Music - TRAGIC VENGEANCE by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'MiddleEastChase', title: 'Intense background music that plays during chasing scene in Middle East' },
    { isFeatured: false, isPublished: true, videoId: 'StrengthEndure', title: 'STRENGTH TO ENDURE - Epic Intense Action Music' },
    { isFeatured: false, isPublished: true, videoId: 'ResilienceBreaks', title: 'Resilience Beyond Breaks (Epic Emotional Music)' },
    { isFeatured: false, isPublished: true, videoId: 'SunriseSymphony', title: 'EPIC ADVENTURE MUSIC - Sunrise Symphony by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'JourneyWaves', title: 'EPIC PIRATE ADVENTURE MUSIC - Journey Across The Waves by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'NewAdventure', title: 'Epic Adventure Music - NEW ADVENTURE BEGINS by FF Orchestral Music' },
    { isFeatured: false, isPublished: true, videoId: 'NeverSurrender', title: 'Never Surrender (Cinematic Corporate Music)' },
    { isFeatured: false, isPublished: true, videoId: 'AssaultShadows', title: 'Assault On Shadows (Epic Cinematic Music)' },
    { isFeatured: false, isPublished: true, videoId: 'TearsBrave', title: 'Tears Of The Brave (Epic Cinematic Music)' },
    { isFeatured: false, isPublished: true, videoId: 'LineOfDuty', title: 'In The Line Of Duty (Epic Action Music)' },
    { isFeatured: false, isPublished: true, videoId: 'fr9ARYi0wqQ', title: 'SANDS OF MARTYRDOM - Epic Arabic Music' },
    { isFeatured: false, isPublished: true, videoId: '85dbXlGyDP8', title: 'Shimmering Destiny (Epic Adventure Music)' },
    { isFeatured: false, isPublished: true, videoId: 'DeterminationHero', title: 'Determination Of A Hero (Epic Cinematic Music)' },
    { isFeatured: false, isPublished: true, videoId: 'Thanks500', title: 'THANK YOU FOR 500 SUBSCRIBERS!' },
    { isFeatured: false, isPublished: true, videoId: 'FlyingSky', title: 'Flying To The Sky (Epic Adventure Music)' },
    { isFeatured: false, isPublished: true, videoId: 'TogetherVictory', title: 'Together Towards Victory (Epic Cinematic Music)' },
    { isFeatured: false, isPublished: true, videoId: 'ShatteredStanding', title: 'Shattered Yet Standing (Epic Emotional Music)' },
    { isFeatured: false, isPublished: true, videoId: 'TowardsHorizon', title: 'Towards The Horizon (Epic Adventure Music)' },
    { isFeatured: false, isPublished: true, videoId: 'LegacyFortitude', title: 'Legacy Of Fortitude (Epic Emotional Music)' },
    { isFeatured: false, isPublished: true, videoId: 'LastBreath', title: 'Till The Last Breath (Epic Cinematic Music)' },
    { isFeatured: false, isPublished: true, videoId: 'DayMetYou', title: 'The Day I Met You (Epic Emotional Music)' },
    { isFeatured: false, isPublished: true, videoId: 'BraceYourself', title: 'Brace Yourself (Epic Action Music)' },
    { isFeatured: false, isPublished: true, videoId: 'WinBattle', title: 'Let Us Win This Battle (Epic Cinematic Music)' },
    { isFeatured: false, isPublished: true, videoId: 'AllAsWant', title: 'All As I Want (Epic Cinematic Music)' },
    { isFeatured: false, isPublished: true, videoId: 'NotTheEnd', title: 'This Is Not The End (Cinematic Corporate Music)' },
    { isFeatured: false, isPublished: true, videoId: 'ChosenOne', title: 'The Chosen One (Epic Cinematic Music)' },
].map((video) => {
    const videoId = getYouTubeId(video.videoId);
    if (!videoId) throw new Error(`Invalid videoId: ${video.videoId}`);
    return {
        ...video,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        category: "Orchestral Cover",
        createdAt: new Date('2025-09-20T10:30:21Z'),
    }
});


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
        // remove videoId if it exists
        if (docData.videoId) {
            delete docData.videoId;
        }

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
