
import { db } from './firebase';
import { collection, getDocs, writeBatch, Timestamp, addDoc } from 'firebase/firestore';

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
    if (data.length === 0) {
        console.log(`No data provided for ${collectionName}. Skipping.`);
        return;
    }
    const collectionRef = collection(db, collectionName);
    for (const item of data) {
        // Ensure createdAt is a Firestore Timestamp if it's not already
        if (item.createdAt && !(item.createdAt instanceof Timestamp)) {
            item.createdAt = Timestamp.fromDate(new Date(item.createdAt));
        }
        await addDoc(collectionRef, item);
    }
    console.log(`Seeded ${data.length} documents into ${collectionName}.`);
}


const videos = [
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:true,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Heroic Motivational Music - OPERATION APEX by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Heroic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:true,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Motivational Music - Heart Of A Warrior by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Motivational"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:true,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"EPIC MOTIVATIONAL MUSIC - Lone Wolf Resolve by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Motivational"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:true,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/vTmzISgwbFk/hqdefault.jpg",title:"Epic Emotional Music - EVERLASTING STRUGGLE by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=vTmzISgwbFk", category: "Emotional"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:true,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Action Music - COURAGE UNDER FIRE by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Action"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:true,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Dark Arabic Music - HASHASHIN by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Arabic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Heroic Motivational Music - VERGE OF VICTORY by Fahmie Farhan Ariffin",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Heroic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Sad Emotional Music - UNTIL WE MEET AGAIN by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Emotional"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Heroic Motivational Music - THE COURAGE WITHIN by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Heroic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dDMkp9DWCEs/hqdefault.jpg",title:"Epic Motivational Music - CONTINUE TO FIGHT by Fahmie Farhan Ariffin",videoUrl:"https://www.youtube.com/watch?v=dDMkp9DWCEs", category: "Motivational"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Uplifting Emotional Music - UNYIELDING SPIRIT by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Uplifting"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"EPIC SCI-FI BATTLE MUSIC - Battlefronts Beyond Time by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Sci-Fi"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Heroic Music - THROUGH BLOOD AND SACRIFICE by Fahmie Farhan Ariffin",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Heroic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/nnjgGg3lRpE/hqdefault.jpg",title:"Epic Heroic Music - THROUGH PAIN AND SUFFERING by Fahmie Farhan Ariffin",videoUrl:"https://www.youtube.com/watch?v=nnjgGg3lRpE", category: "Heroic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"EPIC EMOTIONAL MUSIC - The Solitary Journey by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Emotional"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Action Music - THE LAST STAND",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Action"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Romantic Emotional Music - UNDER THE MOONLIGHT by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Romantic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Adventure Music - The End of Journey by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Adventure"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/JhYP3ijwdRU/hqdefault.jpg",title:"Epic Heroic Music - POWERED UP",videoUrl:"https://www.youtube.com/watch?v=JhYP3ijwdRU", category: "Heroic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Emotional Music - FRAGMENTS OF RESOLVE",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Emotional"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"INVINCIBLE - Epic Heroic Motivational Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Heroic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/_jsKkEolMnQ/hqdefault.jpg",title:"Epic Heroic Music - INTO THE MARTYRDOM",videoUrl:"https://www.youtube.com/watch?v=_jsKkEolMnQ", category: "Heroic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"THE SUCCESSOR - Epic Emotional Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Emotional"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Dark Emotional Music - TRAGIC VENGEANCE by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Dark"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Intense background music that plays during chasing scene in Middle East",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Action"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"STRENGTH TO ENDURE - Epic Intense Action Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Action"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Resilience Beyond Breaks (Epic Emotional Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Emotional"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"EPIC ADVENTURE MUSIC - Sunrise Symphony by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Adventure"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"EPIC PIRATE ADVENTURE MUSIC - Journey Across The Waves by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Adventure"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Epic Adventure Music - NEW ADVENTURE BEGINS by FF Orchestral Music",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Adventure"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Never Surrender (Cinematic Corporate Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Corporate"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Assault On Shadows (Epic Cinematic Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Cinematic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Tears Of The Brave (Epic Cinematic Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Cinematic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"In The Line Of Duty (Epic Action Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Action"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/fr9ARYi0wqQ/hqdefault.jpg",title:"SANDS OF MARTYRDOM - Epic Arabic Music",videoUrl:"https://www.youtube.com/watch?v=fr9ARYi0wqQ", category: "Arabic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/85dbXlGyDP8/hqdefault.jpg",title:"Shimmering Destiny (Epic Adventure Music)",videoUrl:"https://www.youtube.com/watch?v=85dbXlGyDP8", category: "Adventure"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Determination Of A Hero (Epic Cinematic Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Cinematic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"THANK YOU FOR 500 SUBSCRIBERS!",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Announcement"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Flying To The Sky (Epic Adventure Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Adventure"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Together Towards Victory (Epic Cinematic Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Cinematic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Shattered Yet Standing (Epic Emotional Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Emotional"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Towards The Horizon (Epic Adventure Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Adventure"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Legacy Of Fortitude (Epic Emotional Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Emotional"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Till The Last Breath (Epic Cinematic Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Cinematic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"The Day I Met You (Epic Emotional Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Emotional"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Brace Yourself (Epic Action Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Action"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"Let Us Win This Battle (Epic Cinematic Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Cinematic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"All As I Want (Epic Cinematic Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Cinematic"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"This Is Not The End (Cinematic Corporate Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Corporate"},
    {createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true,thumbnailUrl:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",title:"The Chosen One (Epic Cinematic Music)",videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Cinematic"},
];

const blogPosts = [
    {category:"Industry Insights",title:"The Art of Film Scoring: Creating Emotional Landscapes",seoTitle:"The Art of Film Scoring: Creating Emotional Landscapes",seoDescription:"Discover the art of film scoring from orchestral dynamics to emotional storytelling techniques that create memorable cinematic experiences.",tags:"film scoring, orchestral music, composition, cinematic music, storytelling",coverImageUrl:"https://picsum.photos/seed/blog1/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for The Art of Film Scoring"},
    {category:"Music Production",title:"Home Studio Setup Guide for Orchestral Composers",seoTitle:"Home Studio Setup Guide for Orchestral Composers",seoDescription:"Complete guide to setting up a professional home studio for orchestral music composition including equipment recommendations and acoustic tips.",tags:"home studio, music production, orchestral composition, audio equipment, DAW",coverImageUrl:"https://picsum.photos/seed/blog2/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for Home Studio Setup Guide"},
    {category:"Career Advice",title:"5 Essential Tips for Aspiring Film Composers",seoTitle:"Essential Tips for Film Composers",seoDescription:"Starting a career in film scoring? Here are 5 practical tips to help you succeed, from mastering your tools to building your network.",tags:"film scoring, composer, tips, music career, networking",coverImageUrl:"https://picsum.photos/seed/blog3/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for 5 Essential Tips"},
    {category:"Music Theory",title:"Orchestration Fundamentals for Epic Music Composers",seoTitle:"Orchestration Fundamentals for Epic Music",seoDescription:"Master the fundamentals of orchestration for epic music composition, including instrument combinations and orchestral arrangement techniques.",tags:"orchestration, music theory, epic music, composition, instruments",coverImageUrl:"https://picsum.photos/seed/blog4/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for Orchestration Fundamentals"},
    {category:"Technology",title:"Digital Orchestration: How Technology is Changing Music",seoTitle:"Digital Orchestration: Modern Tools for Composers",seoDescription:"Explore how modern technology and virtual instruments are revolutionizing orchestral music composition and production workflows.",tags:"digital orchestration, virtual instruments, sample libraries, music technology, composition",coverImageUrl:"https://picsum.photos/seed/blog5/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for Digital Orchestration"},
    {category:"Creative Process",title:"Navigating the Creative Process: From Ideas to Finished Compositions",seoTitle:"Overcoming Creative Blocks in Music Composition",seoDescription:"Overcome creative blocks and enhance your compositional workflow with proven strategies for maintaining consistent musical creativity.",tags:"creative process, composer life, creativity, inspiration, workflow",coverImageUrl:"https://picsum.photos/seed/blog6/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for Navigating the Creative Process"},
    {category:"Music Business",title:"Understanding Music Licensing: A Composer's Guide to Stock Music",seoTitle:"Music Licensing Guide for Independent Composers",seoDescription:"Learn the fundamentals of music licensing and stock music libraries to monetize your compositions effectively.",tags:"music licensing, stock music, royalty-free, music business, composer income",coverImageUrl:"https://picsum.photos/seed/blog7/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for Understanding Music Licensing"},
    {category:"Cultural Heritage",title:"Blending Tradition with Innovation: Gamelan in Modern Composition",seoTitle:"Gamelan Influence in Modern Orchestral Music",seoDescription:"Discover how traditional gamelan music can inspire and enhance modern orchestral compositions with unique timbres and rhythmic structures.",tags:"gamelan, traditional music, world music, cultural fusion, orchestral music",coverImageUrl:"https://picsum.photos/seed/blog8/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for Blending Tradition with Innovation"},
    {category:"Performance",title:"From Studio to Stage: Working with Live Orchestras",seoTitle:"Working with Live Orchestras: A Composer's Guide",seoDescription:"Essential tips for composers working with live orchestras, from score preparation to rehearsal etiquette and performance considerations.",tags:"live orchestra, performance, score writing, rehearsal, classical music",coverImageUrl:"https://picsum.photos/seed/blog9/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for From Studio to Stage"},
    {category:"Genre Analysis",title:"The Evolution of Epic Music: From Classical to Cinematic",seoTitle:"Understanding Epic Music: Genre Evolution and Characteristics",seoDescription:"Explore the evolution and key characteristics of epic orchestral music, from classical influences to modern trailer music conventions.",tags:"epic music, orchestral music, trailer music, genre analysis, film music",coverImageUrl:"https://picsum.photos/seed/blog10/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for The Evolution of Epic Music"},
    {category:"Collaboration",title:"The Art of Musical Collaboration: Building Successful Creative Partnerships",seoTitle:"Collaborative Composition: Working Successfully with Others",seoDescription:"Master the art of musical collaboration with practical tips for working effectively with directors, producers, and fellow musicians.",tags:"collaboration, teamwork, music industry, communication, professional skills",coverImageUrl:"https://picsum.photos/seed/blog11/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for The Art of Musical Collaboration"},
    {category:"Education",title:"Continuing Education for Composers: Resources and Strategies",seoTitle:"Lifelong Learning for Composers: Staying Sharp and Current",seoDescription:"Discover effective strategies for continuing your musical education and staying current with industry trends and composition techniques.",tags:"music education, learning, composer development, skill building, music courses",coverImageUrl:"https://picsum.photos/seed/blog12/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for Continuing Education"},
    {category:"Mental Health",title:"Maintaining Mental Health as a Professional Composer",seoTitle:"Mental Health for Composers: Thriving in Creative Work",seoDescription:"Essential mental health strategies for composers dealing with creative pressures, irregular income, and the challenges of artistic life.",tags:"mental health, composer life, creativity, wellness, work-life balance",coverImageUrl:"https://picsum.photos/seed/blog13/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for Maintaining Mental Health"},
    {category:"Inspiration",title:"Sources of Musical Inspiration: Finding Your Creative Voice",seoTitle:"Finding Musical Inspiration: Beyond the Notes",seoDescription:"Explore diverse sources of musical inspiration and learn techniques for translating life experiences into compelling compositions.",tags:"inspiration, creativity, composition, artistic development, musical ideas",coverImageUrl:"https://picsum.photos/seed/blog14/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for Sources of Musical Inspiration"},
    {category:"Future Trends",title:"The Future of Music Composition: Technology, Trends, and Opportunities",seoTitle:"Future of Music Composition: Trends and Technologies",seoDescription:"Discover emerging trends in music composition technology, industry changes, and how composers can adapt to the evolving musical landscape.",tags:"future trends, music technology, AI music, industry changes, innovation",coverImageUrl:"https://picsum.photos/seed/blog15/1200/675",createdAt:"2025-09-20T10:30:21.000Z",isFeatured:false,isPublished:true, content: "Content for The Future of Music Composition"},
];

const testimonials = [
    { author: 'Diane Allen', publication: 'Violin Virtuoso', quote: "Fahmie's compositions are pure magic. He has an incredible talent for weaving emotion into every note.", createdAt: "2025-09-20T10:30:21.000Z" },
    { author: 'Ahmad Zahir', publication: 'GEMAWAN KISAS', quote: "Working with Fahmie on the Gamelan project was a revelation. His modern take on traditional music is groundbreaking.", createdAt: "2025-09-20T10:30:21.000Z" },
    { author: 'Indie Game Dev', publication: 'PixelHeart Studios', quote: "The score Fahmie created for our game was perfect. It elevated the entire experience.", createdAt: "2025-09-20T10:30:21.000Z" },
];

const socialLinks = [
    {createdAt:"2025-09-20T10:30:21.000Z",platform:"YouTube",url:"https://www.youtube.com/@FahmieFarhanMusic"},
    {createdAt:"2025-09-20T10:30:21.000Z",platform:"SoundCloud",url:"https://soundcloud.com/fahmiefarhanmusic"},
    {createdAt:"2025-09-20T10:30:21.000Z",platform:"Instagram",url:"https://www.instagram.com/fahmiefarhanmusic"},
    {createdAt:"2025-09-20T10:30:21.000Z",platform:"Website",url:"https://www.fahmiefarhanmusic.com"},
    {createdAt:"2025-09-20T10:30:21.000Z",platform:"Pond5",url:"https://www.pond5.com/artist/fforchestral"},
];

async function main() {
    console.log('Starting to clear database...');
    
    const collectionsToClear = ['blog', 'testimonials', 'social-links', 'videos', 'contacts', 'settings'];
    for (const collectionName of collectionsToClear) {
        await clearCollection(collectionName);
    }

    console.log('Database clearing finished. Starting to seed...');

    await seedCollection('videos', videos);
    await seedCollection('blog', blogPosts);
    await seedCollection('testimonials', testimonials);
    await seedCollection('social-links', socialLinks);

    console.log('Database seeding finished successfully!');
}

main().catch(e => {
  console.error('An error occurred during database seeding:');
  console.error(e);
  process.exit(1);
});

    