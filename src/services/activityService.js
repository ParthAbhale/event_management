import { addDoc, collection, query, serverTimestamp, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export async function logActivity({ userId, eventId = null, actionType, meta = {} }) {
  await addDoc(collection(db, 'activities'), {
    userId,
    eventId,
    actionType,
    meta,
    timestamp: serverTimestamp(),
  });
}

export function subscribeToUserActivity(userId, callback) {
  const activityQuery = query(collection(db, 'activities'), where('userId', '==', userId));

  return onSnapshot(activityQuery, (snapshot) => {
    const data = snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
    callback(data);
  });
}
