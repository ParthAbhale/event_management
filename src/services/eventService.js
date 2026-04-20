import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { logActivity } from './activityService';

const eventsCollection = collection(db, 'events');
const registrationsCollection = collection(db, 'registrations');
const bookmarksCollection = collection(db, 'bookmarks');

export async function createEvent(eventData, user) {
  const docRef = await addDoc(eventsCollection, {
    ...eventData,
    attendeeCount: 0,
    organizer: {
      userId: user.uid,
      name: user.displayName || 'Organizer',
      email: user.email,
      photoURL: user.photoURL || null,
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await logActivity({
    userId: user.uid,
    eventId: docRef.id,
    actionType: 'CREATE_EVENT',
    meta: { title: eventData.title },
  });

  return docRef.id;
}

export async function updateEvent(eventId, eventData, user) {
  const eventRef = doc(db, 'events', eventId);
  await updateDoc(eventRef, {
    ...eventData,
    updatedAt: serverTimestamp(),
  });

  await logActivity({
    userId: user.uid,
    eventId,
    actionType: 'UPDATE_EVENT',
    meta: { title: eventData.title },
  });
}

export async function cancelEvent(eventId, user) {
  const eventRef = doc(db, 'events', eventId);
  await updateDoc(eventRef, {
    status: 'Cancelled',
    updatedAt: serverTimestamp(),
  });

  await logActivity({ userId: user.uid, eventId, actionType: 'CANCEL_EVENT' });
}

export function subscribeToEvents(callback) {
  const eventsQuery = query(eventsCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(eventsQuery, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
  });
}

export function subscribeToFeaturedEvents(callback) {
  const eventsQuery = query(eventsCollection, orderBy('createdAt', 'desc'), limit(6));
  return onSnapshot(eventsQuery, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
  });
}

export function subscribeToEvent(eventId, callback) {
  const eventRef = doc(db, 'events', eventId);
  return onSnapshot(eventRef, (docSnap) => {
    callback(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null);
  });
}

export async function getEventById(eventId) {
  const eventRef = doc(db, 'events', eventId);
  const eventSnapshot = await getDoc(eventRef);
  return eventSnapshot.exists() ? { id: eventSnapshot.id, ...eventSnapshot.data() } : null;
}

export function subscribeToEventsByOrganizer(userId, callback) {
  const eventsQuery = query(eventsCollection, where('organizer.userId', '==', userId));
  return onSnapshot(eventsQuery, (snapshot) => {
    callback(
      snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)),
    );
  });
}

export function subscribeToUserRegistrations(userId, callback) {
  const registrationQuery = query(registrationsCollection, where('userId', '==', userId));

  return onSnapshot(registrationQuery, async (snapshot) => {
    const registrations = snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
    const events = await Promise.all(
      registrations.map(async (registration) => {
        const eventSnapshot = await getDoc(doc(db, 'events', registration.eventId));
        return eventSnapshot.exists()
          ? { id: eventSnapshot.id, ...eventSnapshot.data(), registrationId: registration.id }
          : null;
      }),
    );
    callback(events.filter(Boolean));
  });
}

export async function registerForEvent(eventId, user) {
  const registrationId = `${eventId}_${user.uid}`;
  const registrationRef = doc(db, 'registrations', registrationId);
  const eventRef = doc(db, 'events', eventId);

  const existingRegistration = await getDoc(registrationRef);
  if (existingRegistration.exists()) return;

  await setDoc(registrationRef, {
    eventId,
    userId: user.uid,
    userName: user.displayName || 'Attendee',
    userEmail: user.email,
    userPhotoURL: user.photoURL || null,
    timestamp: serverTimestamp(),
  });

  const eventSnapshot = await getDoc(eventRef);
  const currentCount = eventSnapshot.data()?.attendeeCount || 0;
  await updateDoc(eventRef, { attendeeCount: currentCount + 1, updatedAt: serverTimestamp() });

  await logActivity({ userId: user.uid, eventId, actionType: 'REGISTER_EVENT' });
}

export async function cancelRegistration(eventId, user) {
  const registrationId = `${eventId}_${user.uid}`;
  const registrationRef = doc(db, 'registrations', registrationId);
  const eventRef = doc(db, 'events', eventId);

  const existingRegistration = await getDoc(registrationRef);
  if (!existingRegistration.exists()) return;

  await deleteDoc(registrationRef);

  const eventSnapshot = await getDoc(eventRef);
  const currentCount = eventSnapshot.data()?.attendeeCount || 0;
  await updateDoc(eventRef, {
    attendeeCount: Math.max(0, currentCount - 1),
    updatedAt: serverTimestamp(),
  });

  await logActivity({ userId: user.uid, eventId, actionType: 'CANCEL_REGISTRATION' });
}

export function subscribeToEventAttendees(eventId, callback) {
  const attendeeQuery = query(registrationsCollection, where('eventId', '==', eventId));
  return onSnapshot(attendeeQuery, (snapshot) => {
    callback(
      snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)),
    );
  });
}

export function subscribeToUserBookmarks(userId, callback) {
  const bookmarkQuery = query(bookmarksCollection, where('userId', '==', userId));
  return onSnapshot(bookmarkQuery, async (snapshot) => {
    const bookmarks = snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
    const events = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const eventSnapshot = await getDoc(doc(db, 'events', bookmark.eventId));
        return eventSnapshot.exists() ? { id: eventSnapshot.id, ...eventSnapshot.data() } : null;
      }),
    );
    callback(events.filter(Boolean));
  });
}

export function subscribeToSingleBookmark(eventId, userId, callback) {
  const bookmarkRef = doc(db, 'bookmarks', `${eventId}_${userId}`);
  return onSnapshot(bookmarkRef, (docSnap) => callback(docSnap.exists()));
}

export async function toggleBookmark(eventId, user) {
  const bookmarkId = `${eventId}_${user.uid}`;
  const bookmarkRef = doc(db, 'bookmarks', bookmarkId);
  const existing = await getDoc(bookmarkRef);

  if (existing.exists()) {
    await deleteDoc(bookmarkRef);
    return false;
  }

  await setDoc(bookmarkRef, {
    eventId,
    userId: user.uid,
    timestamp: serverTimestamp(),
  });
  return true;
}

export async function isRegistered(eventId, userId) {
  const registrationSnapshot = await getDoc(doc(db, 'registrations', `${eventId}_${userId}`));
  return registrationSnapshot.exists();
}

export async function fetchDashboardCounts(userId) {
  const createdSnapshot = await getDocs(query(eventsCollection, where('organizer.userId', '==', userId)));
  const joinedSnapshot = await getDocs(query(registrationsCollection, where('userId', '==', userId)));

  return {
    createdCount: createdSnapshot.size,
    joinedCount: joinedSnapshot.size,
  };
}
