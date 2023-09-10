import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {

    apiKey: process.env.VITE_API_KEY,
    authDomain: process.env.VITE_AUTH_DOMAIN,
    databaseURL: process.env.VITE_DATABASE_URL,
    projectId: process.env.VITE_PROJECT_ID,
    storageBucket: process.env.VITE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_APP_ID,
    measurementId: process.env.VITE_MEASUREMENT_ID,

}

const app = initializeApp( firebaseConfig );
export const storage = getStorage( app );