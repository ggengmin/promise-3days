import { db } from './firebase';
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';

export interface PromiseData {
  id?: string;
  content: string;
  creatorName: string;
  isPublic: boolean;
  createdAt: Timestamp;
  notificationDate: Timestamp;
  fcmTokens: string[];
  status: 'pending' | 'notified' | 'completed';
}

export const createPromise = async (
  content: string,
  creatorName: string,
  isPublic: boolean
) => {
  const notificationDate = new Date();
  notificationDate.setDate(notificationDate.getDate() + 3);

  const promiseData = {
    content,
    creatorName,
    isPublic,
    createdAt: serverTimestamp(),
    notificationDate: Timestamp.fromDate(notificationDate),
    fcmTokens: [],
    status: 'pending' as const,
  };

  const docRef = await addDoc(collection(db, 'promises'), promiseData);
  return docRef.id;
};

export const getPromiseById = async (id: string) => {
  const docRef = doc(db, 'promises', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as PromiseData;
  }
  return null;
};

export const addFCMToken = async (promiseId: string, token: string) => {
  const docRef = doc(db, 'promises', promiseId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const currentTokens = docSnap.data().fcmTokens || [];
    if (!currentTokens.includes(token)) {
      await updateDoc(docRef, {
        fcmTokens: [...currentTokens, token],
      });
    }
  }
};

export const getPublicPromises = async () => {
  const q = query(
    collection(db, 'promises'),
    where('isPublic', '==', true),
    where('status', '==', 'pending')
  );

  const querySnapshot = await getDocs(q);
  const promises: PromiseData[] = [];

  querySnapshot.forEach((document) => {
    const data = document.data();
    const createdAt = data.createdAt as Timestamp;
    const now = new Date();
    const createdDate = createdAt.toDate();
    const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      promises.push({ id: document.id, ...data } as PromiseData);
    }
  });

  return promises;
};

export const deleteOldPromises = async () => {
  const q = query(collection(db, 'promises'), where('isPublic', '==', true));
  const querySnapshot = await getDocs(q);

  const now = new Date();
  const deletionPromises: any[] = [];

  querySnapshot.forEach((document) => {
    const data = document.data();
    const createdAt = data.createdAt as Timestamp;
    const createdDate = createdAt.toDate();
    const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
      deletionPromises.push(deleteDoc(doc(db, 'promises', document.id)));
    }
  });

  await Promise.all(deletionPromises);
};