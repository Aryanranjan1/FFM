
import { db } from './firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';

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

async function main() {
    console.log('Starting to clear database...');
    
    const collectionsToClear = ['blog', 'testimonials', 'social-links', 'videos', 'contacts', 'settings'];
    for (const collectionName of collectionsToClear) {
        await clearCollection(collectionName);
    }

    console.log('Database clearing finished successfully!');
}

main().catch(e => {
  console.error('An error occurred during database clearing:');
  console.error(e);
  process.exit(1);
});
