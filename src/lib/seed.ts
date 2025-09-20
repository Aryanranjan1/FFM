
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
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/APEX/hqdefault.jpg', title: 'Epic Heroic Motivational Music - OPERATION APEX by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=APEX' },
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/HeartWarrior/hqdefault.jpg', title: 'Epic Motivational Music - Heart Of A Warrior by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=HeartWarrior' },
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/LoneWolf/hqdefault.jpg', title: 'EPIC MOTIVATIONAL MUSIC - Lone Wolf Resolve by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=LoneWolf' },
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/vTmzISgwbFk/hqdefault.jpg', title: 'Epic Emotional Music - EVERLASTING STRUGGLE by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=vTmzISgwbFk' },
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/CourageFire/hqdefault.jpg', title: 'Epic Action Music - COURAGE UNDER FIRE by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=CourageFire' },
    { isFeatured: true, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/Hashashin/hqdefault.jpg', title: 'Epic Dark Arabic Music - HASHASHIN by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=Hashashin' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/VergeVictory/hqdefault.jpg', title: 'Epic Heroic Motivational Music - VERGE OF VICTORY by Fahmie Farhan Ariffin', videoUrl: 'https://www.youtube.com/watch?v=VergeVictory' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/UntilMeet/hqdefault.jpg', title: 'Sad Emotional Music - UNTIL WE MEET AGAIN by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=UntilMeet' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/CourageWithin/hqdefault.jpg', title: 'Epic Heroic Motivational Music - THE COURAGE WITHIN by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=CourageWithin' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/dDMkp9DWCEs/hqdefault.jpg', title: 'Epic Motivational Music - CONTINUE TO FIGHT by Fahmie Farhan Ariffin', videoUrl: 'https://www.youtube.com/watch?v=dDMkp9DWCEs' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/UnyieldingSpirit/hqdefault.jpg', title: 'Epic Uplifting Emotional Music - UNYIELDING SPIRIT by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=UnyieldingSpirit' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/BattlefrontsBeyond/hqdefault.jpg', title: 'EPIC SCI-FI BATTLE MUSIC - Battlefronts Beyond Time by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=BattlefrontsBeyond' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/BloodSacrifice/hqdefault.jpg', title: 'Epic Heroic Music - THROUGH BLOOD AND SACRIFICE by Fahmie Farhan Ariffin', videoUrl: 'https://www.youtube.com/watch?v=BloodSacrifice' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/nnjgGg3lRpE/hqdefault.jpg', title: 'Epic Heroic Music - THROUGH PAIN AND SUFFERING by Fahmie Farhan Ariffin', videoUrl: 'https://www.youtube.com/watch?v=nnjgGg3lRpE' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/SolitaryJourney/hqdefault.jpg', title: 'EPIC EMOTIONAL MUSIC - The Solitary Journey by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=SolitaryJourney' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/LastStand/hqdefault.jpg', title: 'Epic Action Music - THE LAST STAND', videoUrl: 'https://www.youtube.com/watch?v=LastStand' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/UnderMoonlight/hqdefault.jpg', title: 'Romantic Emotional Music - UNDER THE MOONLIGHT by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=UnderMoonlight' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/EndJourney/hqdefault.jpg', title: 'Epic Adventure Music - The End of Journey by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=EndJourney' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/JhYP3ijwdRU/hqdefault.jpg', title: 'Epic Heroic Music - POWERED UP', videoUrl: 'https://www.youtube.com/watch?v=JhYP3ijwdRU' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/FragmentsResolve/hqdefault.jpg', title: 'Epic Emotional Music - FRAGMENTS OF RESOLVE', videoUrl: 'https://www.youtube.com/watch?v=FragmentsResolve' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/Invincible/hqdefault.jpg', title: 'INVINCIBLE - Epic Heroic Motivational Music', videoUrl: 'https://www.youtube.com/watch?v=Invincible' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/_jsKkEolMnQ/hqdefault.jpg', title: 'Epic Heroic Music - INTO THE MARTYRDOM', videoUrl: 'https://www.youtube.com/watch?v=_jsKkEolMnQ' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/Successor/hqdefault.jpg', title: 'THE SUCCESSOR - Epic Emotional Music', videoUrl: 'https://www.youtube.com/watch?v=Successor' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/TragicVengeance/hqdefault.jpg', title: 'Epic Dark Emotional Music - TRAGIC VENGEANCE by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=TragicVengeance' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/MiddleEastChase/hqdefault.jpg', title: 'Intense background music that plays during chasing scene in Middle East', videoUrl: 'https://www.youtube.com/watch?v=MiddleEastChase' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/StrengthEndure/hqdefault.jpg', title: 'STRENGTH TO ENDURE - Epic Intense Action Music', videoUrl: 'https://www.youtube.com/watch?v=StrengthEndure' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/ResilienceBreaks/hqdefault.jpg', title: 'Resilience Beyond Breaks (Epic Emotional Music)', videoUrl: 'https://www.youtube.com/watch?v=ResilienceBreaks' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/SunriseSymphony/hqdefault.jpg', title: 'EPIC ADVENTURE MUSIC - Sunrise Symphony by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=SunriseSymphony' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/JourneyWaves/hqdefault.jpg', title: 'EPIC PIRATE ADVENTURE MUSIC - Journey Across The Waves by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=JourneyWaves' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/NewAdventure/hqdefault.jpg', title: 'Epic Adventure Music - NEW ADVENTURE BEGINS by FF Orchestral Music', videoUrl: 'https://www.youtube.com/watch?v=NewAdventure' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/NeverSurrender/hqdefault.jpg', title: 'Never Surrender (Cinematic Corporate Music)', videoUrl: 'https://www.youtube.com/watch?v=NeverSurrender' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/AssaultShadows/hqdefault.jpg', title: 'Assault On Shadows (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=AssaultShadows' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/TearsBrave/hqdefault.jpg', title: 'Tears Of The Brave (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=TearsBrave' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/LineOfDuty/hqdefault.jpg', title: 'In The Line Of Duty (Epic Action Music)', videoUrl: 'https://www.youtube.com/watch?v=LineOfDuty' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/fr9ARYi0wqQ/hqdefault.jpg', title: 'SANDS OF MARTYRDOM - Epic Arabic Music', videoUrl: 'https://www.youtube.com/watch?v=fr9ARYi0wqQ' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/85dbXlGyDP8/hqdefault.jpg', title: 'Shimmering Destiny (Epic Adventure Music)', videoUrl: 'https://www.youtube.com/watch?v=85dbXlGyDP8' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/DeterminationHero/hqdefault.jpg', title: 'Determination Of A Hero (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=DeterminationHero' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/Thanks500/hqdefault.jpg', title: 'THANK YOU FOR 500 SUBSCRIBERS!', videoUrl: 'https://www.youtube.com/watch?v=Thanks500' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/FlyingSky/hqdefault.jpg', title: 'Flying To The Sky (Epic Adventure Music)', videoUrl: 'https://www.youtube.com/watch?v=FlyingSky' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/TogetherVictory/hqdefault.jpg', title: 'Together Towards Victory (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=TogetherVictory' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/ShatteredStanding/hqdefault.jpg', title: 'Shattered Yet Standing (Epic Emotional Music)', videoUrl: 'https://www.youtube.com/watch?v=ShatteredStanding' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/TowardsHorizon/hqdefault.jpg', title: 'Towards The Horizon (Epic Adventure Music)', videoUrl: 'https://www.youtube.com/watch?v=TowardsHorizon' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/LegacyFortitude/hqdefault.jpg', title: 'Legacy Of Fortitude (Epic Emotional Music)', videoUrl: 'https://www.youtube.com/watch?v=LegacyFortitude' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/LastBreath/hqdefault.jpg', title: 'Till The Last Breath (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=LastBreath' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/DayMetYou/hqdefault.jpg', title: 'The Day I Met You (Epic Emotional Music)', videoUrl: 'https://www.youtube.com/watch?v=DayMetYou' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/BraceYourself/hqdefault.jpg', title: 'Brace Yourself (Epic Action Music)', videoUrl: 'https://www.youtube.com/watch?v=BraceYourself' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/WinBattle/hqdefault.jpg', title: 'Let Us Win This Battle (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=WinBattle' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/AllAsWant/hqdefault.jpg', title: 'All As I Want (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=AllAsWant' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/NotTheEnd/hqdefault.jpg', title: 'This Is Not The End (Cinematic Corporate Music)', videoUrl: 'https://www.youtube.com/watch?v=NotTheEnd' },
    { isFeatured: false, isPublished: true, thumbnailUrl: 'https://img.youtube.com/vi/ChosenOne/hqdefault.jpg', title: 'The Chosen One (Epic Cinematic Music)', videoUrl: 'https://www.youtube.com/watch?v=ChosenOne' },
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
