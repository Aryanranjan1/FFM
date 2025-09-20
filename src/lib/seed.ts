import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { albums, projects, testimonials, socialLinks } from './data';
import { PlaceHolderImages } from './placeholder-images';

async function seedMusic() {
  const musicCollection = collection(db, 'music');
  console.log('Seeding music...');

  for (const album of albums) {
    for (const track of album.tracks) {
      const coverArt = PlaceHolderImages.find(p => p.id === album.coverArtId);
      const trackData = {
        title: track.title,
        musicUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder URL
        coverImageUrl: coverArt?.imageUrl || '',
        category: album.title,
        isFeatured: Math.random() > 0.5,
        isPublished: true,
        createdAt: Timestamp.now(),
      };
      await addDoc(musicCollection, trackData);
      console.log(`Added track: ${track.title}`);
    }
  }

  console.log('Music seeding complete.');
}

async function seedVideos() {
  const videosCollection = collection(db, 'videos');
  console.log('Seeding videos...');

  for (const project of projects) {
    const thumbnail = PlaceHolderImages.find(p => p.id === project.imageId);
    const videoData = {
      title: project.title,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder URL
      description: project.description,
      tags: project.category.toLowerCase(),
      thumbnailUrl: thumbnail?.imageUrl || '',
      isPublished: true,
      isFeatured: Math.random() > 0.5,
      createdAt: Timestamp.fromDate(new Date(project.date)),
    };
    await addDoc(videosCollection, videoData);
    console.log(`Added video: ${project.title}`);
  }

  console.log('Video seeding complete.');
}

async function seedTestimonials() {
  const testimonialsCollection = collection(db, 'testimonials');
  console.log('Seeding testimonials...');

  for (const testimonial of testimonials) {
    const testimonialData = {
      ...testimonial,
      createdAt: Timestamp.now(),
    };
    await addDoc(testimonialsCollection, testimonialData);
    console.log(`Added testimonial from: ${testimonial.author}`);
  }

  console.log('Testimonials seeding complete.');
}

async function seedSocialLinks() {
  const socialLinksCollection = collection(db, 'social-links');
  console.log('Seeding social links...');

  for (const socialLink of socialLinks) {
    const socialLinkData = {
      ...socialLink,
      createdAt: Timestamp.now(),
    };
    await addDoc(socialLinksCollection, socialLinkData);
    console.log(`Added social link: ${socialLink.platform}`);
  }

  console.log('Social links seeding complete.');
}


async function main() {
  console.log('Starting database seeding...');
  await seedMusic();
  await seedVideos();
  await seedTestimonials();
  await seedSocialLinks();
  console.log('Database seeding finished successfully!');
}

main().catch(e => {
  console.error('An error occurred during seeding:');
  console.error(e);
  process.exit(1);
});
