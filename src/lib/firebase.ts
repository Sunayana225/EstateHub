// Firebase configuration and initialization
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
// For demo purposes, using a demo project config
// In production, replace with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
}

// Initialize Firebase
let app
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize Firebase Auth
export const auth = getAuth(app)

// Initialize Firestore
export const db = getFirestore(app)

// For development/demo purposes, you can use Firebase emulators
// Uncomment these lines if you want to use local emulators
// if (process.env.NODE_ENV === 'development') {
//   try {
//     connectAuthEmulator(auth, 'http://localhost:9099')
//     connectFirestoreEmulator(db, 'localhost', 8080)
//   } catch (error) {
//     console.log('Emulators already connected')
//   }
// }

export default app
