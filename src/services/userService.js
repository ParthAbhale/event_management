import { doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from './firebase';

export function subscribeToUserProfile(userId, callback) {
  return onSnapshot(doc(db, 'users', userId), (docSnap) => {
    callback(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null);
  });
}

export async function updateUserProfile({ user, name, photoURL }) {
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    ...(name ? { name } : {}),
    ...(photoURL ? { photoURL } : {}),
    updatedAt: serverTimestamp(),
  });

  await updateProfile(user, {
    displayName: name || user.displayName,
    photoURL: photoURL || user.photoURL,
  });
}
