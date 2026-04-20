import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { generateAvatarFromName } from '../utils/avatar';

export async function upsertUserProfile(user, extraData = {}) {
  const profileRef = doc(db, 'users', user.uid);
  const payload = {
    uid: user.uid,
    name: extraData.name || user.displayName || 'User',
    email: user.email,
    photoURL: extraData.photoURL || user.photoURL || generateAvatarFromName(extraData.name || user.displayName || 'User'),
    updatedAt: serverTimestamp(),
  };

  if (extraData.isNewUser) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(profileRef, payload, { merge: true });
}

export async function signupWithEmail({ name, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = credential;

  await updateProfile(user, {
    displayName: name,
    photoURL: generateAvatarFromName(name),
  });

  await upsertUserProfile(
    {
      ...user,
      displayName: name,
      photoURL: generateAvatarFromName(name),
    },
    { name, isNewUser: true },
  );

  return user;
}

export async function loginWithEmail({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await upsertUserProfile(credential.user);
  return credential.user;
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await upsertUserProfile(credential.user, { isNewUser: credential?._tokenResponse?.isNewUser });
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}
