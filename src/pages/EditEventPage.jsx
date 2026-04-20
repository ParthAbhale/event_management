import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventForm from '../components/events/EventForm';
import SectionHeader from '../components/common/SectionHeader';
import PageLoader from '../components/common/PageLoader';
import { useAuth } from '../context/AuthContext';
import { getEventById, updateEvent } from '../services/eventService';
import { uploadImage } from '../services/storageService';

function EditEventPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getEventById(eventId).then((eventData) => {
      if (!eventData || eventData.organizer?.userId !== user?.uid) {
        toast.error('You cannot edit this event.');
        navigate('/events');
        return;
      }
      setEvent(eventData);
      setLoading(false);
    });
  }, [eventId, user, navigate]);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      const bannerImage = form.bannerFile ? await uploadImage(form.bannerFile) : event.bannerImage;
      await updateEvent(
        eventId,
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
      toast.success('Event updated successfully.');
      navigate(`/events/${eventId}`);
    } catch (error) {
      toast.error(error.message || 'Unable to update event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="container page-section page-stack">
      <SectionHeader eyebrow="Edit event" title="Update your event" description="Only the event creator can make changes." />
      <EventForm initialValues={event} onSubmit={handleSubmit} loading={submitting} />
    </div>
  );
}

export default EditEventPage;
