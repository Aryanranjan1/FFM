
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-436308890-ca98e",
  "appId": "1:450542759463:web:7265a7235a1a2035ebe802",
  "apiKey": "AIzaSyCoFcgHomuKrx1CLlAavG0168djaVMmcoE",
  "authDomain": "studio-436308890-ca98e.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "450542759463"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
