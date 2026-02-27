import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

// Inline literals — Next.js statically replaces NEXT_PUBLIC_ at build time
// so these are always available on the client as real strings.
export const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  databaseURL:       process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Always delete previous apps before init so stale SSR instances don't persist
async function resetAndGetApp(): Promise<FirebaseApp> {
  try {
    const existing = getApps();
    if (existing.length > 0) return existing[0];
    return initializeApp(firebaseConfig);
  } catch {
    return initializeApp(firebaseConfig, `app-${Date.now()}`);
  }
}

// Lazily initialised — call only inside useEffect on the client
let _db: Database | null = null;
export function getDb(): Database {
  if (_db) return _db;
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  _db = getDatabase(app);
  return _db;
}
