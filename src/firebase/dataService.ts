import { 
  doc, 
  getDoc, 
  setDoc, 
  collection,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { db } from './index';
import { FeederLookup, SavedReport, SavedWeek } from '../types';

const COLLECTIONS = {
  FEEDER_LOOKUP: 'feederLookup',
  CURRENT_REPORT: 'currentReport',
  PREVIOUS_REPORT: 'previousReport',
  SAVED_WEEKS: 'savedWeeks',
  USERS: 'users'
};

// ==================== FEEDER LOOKUP ====================

export async function saveFeederLookup(lookup: FeederLookup): Promise<void> {
  const docRef = doc(db, COLLECTIONS.FEEDER_LOOKUP, 'main');
  await setDoc(docRef, { 
    data: lookup,
    updatedAt: new Date().toISOString()
  });
}

export async function getFeederLookup(): Promise<FeederLookup | null> {
  const docRef = doc(db, COLLECTIONS.FEEDER_LOOKUP, 'main');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data().data as FeederLookup;
  }
  return null;
}

export async function clearFeederLookup(): Promise<void> {
  const docRef = doc(db, COLLECTIONS.FEEDER_LOOKUP, 'main');
  await deleteDoc(docRef);
}

// ==================== CURRENT REPORT ====================

export async function saveCurrentReport(report: SavedReport): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CURRENT_REPORT, 'main');
  await setDoc(docRef, {
    ...report,
    savedAt: new Date().toISOString()
  });
}

export async function getCurrentReport(): Promise<SavedReport | null> {
  const docRef = doc(db, COLLECTIONS.CURRENT_REPORT, 'main');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as SavedReport;
  }
  return null;
}

// ==================== PREVIOUS WEEK REPORT ====================

export async function savePreviousReport(report: SavedReport): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PREVIOUS_REPORT, 'main');
  await setDoc(docRef, {
    ...report,
    savedAt: new Date().toISOString()
  });
}

export async function getPreviousReport(): Promise<SavedReport | null> {
  const docRef = doc(db, COLLECTIONS.PREVIOUS_REPORT, 'main');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as SavedReport;
  }
  return null;
}

// ==================== USER AUTHENTICATION ====================

export interface UserCredentials {
  username: string;
  passwordHash: string;
  createdAt: string;
}

// Simple hash function for password (not cryptographically secure, but better than plain text)
// For production, consider using Firebase Authentication
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createUser(username: string, password: string): Promise<void> {
  const passwordHash = await hashPassword(password);
  const docRef = doc(db, COLLECTIONS.USERS, username.toLowerCase());
  await setDoc(docRef, {
    username: username.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString()
  });
}

export async function validateUser(username: string, password: string): Promise<boolean> {
  const docRef = doc(db, COLLECTIONS.USERS, username.toLowerCase());
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return false;
  }
  
  const user = docSnap.data() as UserCredentials;
  const passwordHash = await hashPassword(password);
  
  return user.passwordHash === passwordHash;
}

export async function userExists(username: string): Promise<boolean> {
  const docRef = doc(db, COLLECTIONS.USERS, username.toLowerCase());
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export async function getAllUsers(): Promise<string[]> {
  const colRef = collection(db, COLLECTIONS.USERS);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => doc.id);
}

// Check if ANY user exists in Firebase (for first-time setup check)
export async function anyUserExists(): Promise<boolean> {
  try {
    const colRef = collection(db, COLLECTIONS.USERS);
    const snapshot = await getDocs(colRef);
    const hasUsers = !snapshot.empty;
    console.log('Checking if any user exists in Firebase:', hasUsers, 'Users found:', snapshot.size);
    return hasUsers;
  } catch (error) {
    console.error('Error checking if any user exists:', error);
    throw error;
  }
}

// ==================== SAVED WEEKS (Multiple Weeks) ====================

export async function saveWeekReport(week: SavedWeek): Promise<void> {
  const weekId = `week_${week.weekNumber}`;
  const docRef = doc(db, COLLECTIONS.SAVED_WEEKS, weekId);
  await setDoc(docRef, {
    ...week,
    id: weekId,
    savedAt: new Date().toISOString()
  });
}

export async function getSavedWeeks(): Promise<SavedWeek[]> {
  const colRef = collection(db, COLLECTIONS.SAVED_WEEKS);
  const snapshot = await getDocs(colRef);
  const weeks: SavedWeek[] = [];
  
  snapshot.forEach((docSnap) => {
    weeks.push({ id: docSnap.id, ...docSnap.data() } as SavedWeek);
  });
  
  // Sort by week number descending (newest first)
  return weeks.sort((a, b) => b.weekNumber - a.weekNumber);
}

export async function getWeekByNumber(weekNumber: number): Promise<SavedWeek | null> {
  const weekId = `week_${weekNumber}`;
  const docRef = doc(db, COLLECTIONS.SAVED_WEEKS, weekId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as SavedWeek;
  }
  return null;
}

export async function deleteWeekReport(weekNumber: number): Promise<void> {
  const weekId = `week_${weekNumber}`;
  const docRef = doc(db, COLLECTIONS.SAVED_WEEKS, weekId);
  await deleteDoc(docRef);
}

export async function weekExists(weekNumber: number): Promise<boolean> {
  const weekId = `week_${weekNumber}`;
  const docRef = doc(db, COLLECTIONS.SAVED_WEEKS, weekId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}
