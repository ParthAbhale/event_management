import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventForm from '../components/events/EventForm';
import SectionHeader from '../components/common/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { createEvent } from '../services/eventService';
import { uploadImage } from '../services/storageService';

function CreateEventPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      const bannerImage = await uploadImage(form.bannerFile);

      const eventId = await createEvent(
        {
          title: form.title,
          description: form.description,
          location: form.location,
          dateTime: form.dateTime,
          category: form.category,
          status: form.status,
          bannerImage,
        },
        user,
      );

      toast.success('Event created successfully.');
      navigate(`/events/${eventId}`);
    } catch (error) {
      toast.error(error.message || 'Unable to create the event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-section page-stack">
      <SectionHeader eyebrow="Creator mode" title="Create a new event" description="All event data, including banner images, is stored in Firestore." />
      <EventForm onSubmit={handleSubmit} loading={loading} requireBanner />
    </div>
  );
}

export default CreateEventPage;
