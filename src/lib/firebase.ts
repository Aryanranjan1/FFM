
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-436308890-ca98e",
  "appId": "1:450542759463:web:7265a7235a1a2035ebe802",
  "apiKey": "AIzaSyCoFcgHomuKrx1CLlAavG0168djaVMmcoE",
  "authDomain": "studio-436308890-ca98e.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "450542759463"
};

let app: FirebaseApp;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

db = getFirestore(app);

export { app, db };
