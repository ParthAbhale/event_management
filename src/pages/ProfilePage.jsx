import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/profile/ProfileForm';
import SectionHeader from '../components/common/SectionHeader';
import EventGrid from '../components/events/EventGrid';
import { subscribeToEventsByOrganizer, subscribeToUserRegistrations } from '../services/eventService';
import { useFirestoreSubscription } from '../hooks/useFirestoreSubscription';
import { updateUserProfile } from '../services/userService';
import { uploadImage } from '../services/storageService';

function ProfilePage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const { data: createdEvents, loading: loadingCreated } = useFirestoreSubscription(
    (callback) => subscribeToEventsByOrganizer(user.uid, callback),
    [user.uid],
  );
  const { data: joinedEvents, loading: loadingJoined } = useFirestoreSubscription(
    (callback) => subscribeToUserRegistrations(user.uid, callback),
    [user.uid],
  );

  const handleSubmit = async ({ name, file }) => {
    setLoading(true);
    try {
      const photoURL = file ? await uploadImage(file) : undefined;
      await updateUserProfile({ user, name, photoURL });
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(error.message || 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-section page-stack">
      <SectionHeader eyebrow="Identity" title="Profile settings" description="Manage your public identity, avatar, and event participation." />
      <ProfileForm profile={profile} onSubmit={handleSubmit} loading={loading} />
      <section className="page-stack">
        <SectionHeader title="Events created by you" />
        <EventGrid events={createdEvents} loading={loadingCreated} emptyText="Your created events will show here." />
      </section>
      <section className="page-stack">
        <SectionHeader title="Events joined by you" />
        <EventGrid events={joinedEvents} loading={loadingJoined} emptyText="Joined events will show here." />
      </section>
    </div>
  );
}

export default ProfilePage;
