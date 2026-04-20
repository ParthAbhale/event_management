import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Bookmark, CalendarDays, Edit, MapPin, Share2, UserRound, Users, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  cancelEvent,
  cancelRegistration,
  isRegistered,
  registerForEvent,
  subscribeToEvent,
  subscribeToEventAttendees,
  subscribeToSingleBookmark,
  toggleBookmark,
} from '../services/eventService';
import { useFirestoreSubscription } from '../hooks/useFirestoreSubscription';
import PageLoader from '../components/common/PageLoader';
import { formatDateTime, getStatusTone } from '../utils/formatters';

function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [registered, setRegistered] = useState(false);
  const [bookmarkState, setBookmarkState] = useState(false);
  const [busy, setBusy] = useState(false);

  const { data: event, loading } = useFirestoreSubscription(
    (callback) => subscribeToEvent(eventId, callback),
    [eventId],
    null,
  );

  const { data: attendees } = useFirestoreSubscription(
    (callback) => subscribeToEventAttendees(eventId, callback),
    [eventId],
    [],
  );

  useEffect(() => {
    if (!user) return undefined;

    isRegistered(eventId, user.uid).then(setRegistered);
    const unsubscribe = subscribeToSingleBookmark(eventId, user.uid, setBookmarkState);
    return () => unsubscribe?.();
  }, [eventId, user]);

  const isOwner = useMemo(() => event?.organizer?.userId === user?.uid, [event, user]);

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please login to join the event.');
      navigate('/auth');
      return;
    }

    setBusy(true);
    try {
      if (registered) {
        await cancelRegistration(eventId, user);
        setRegistered(false);
        toast.success('Registration cancelled.');
      } else {
        await registerForEvent(eventId, user);
        setRegistered(true);
        toast.success('You are registered for this event.');
      }
    } catch (error) {
      toast.error(error.message || 'Could not update registration.');
    } finally {
      setBusy(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please login to save events.');
      return;
    }
    const nextState = await toggleBookmark(eventId, user);
    setBookmarkState(nextState);
    toast.success(nextState ? 'Event saved.' : 'Bookmark removed.');
  };

  const handleCancelEvent = async () => {
    if (!isOwner) return;
    setBusy(true);
    try {
      await cancelEvent(eventId, user);
      toast.success('Event cancelled successfully.');
    } catch (error) {
      toast.error(error.message || 'Unable to cancel event.');
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Event link copied.');
  };

  if (loading) return <PageLoader />;
  if (!event) return <div className="container page-section"><div className="empty-state"><h3>Event not found</h3></div></div>;

  return (
    <div className="container page-section page-stack">
      <section className="details-hero card">
        <div className="details-hero__media">
          <img className="details-hero__image" src={event.bannerImage} alt={event.title} />
        </div>
        <div className="details-hero__content">
          <div className="details-hero__header-row">
            <span className="pill">{event.category}</span>
            <span className={getStatusTone(event.status)}>{event.status}</span>
          </div>
          <h1>{event.title}</h1>
          <p className="details-hero__description">{event.description}</p>
          <div className="details-grid">
            <span className="details-grid__item"><CalendarDays size={18} /> {formatDateTime(event.dateTime)}</span>
            <span className="details-grid__item"><MapPin size={18} /> {event.location}</span>
            <span className="details-grid__item"><Users size={18} /> {event.attendeeCount || attendees.length} attendees</span>
            <span className="details-grid__item"><UserRound size={18} /> Organized by {event.organizer?.name}</span>
          </div>
          <div className="details-actions">
            {!isOwner ? (
              <button className="button button--primary" disabled={busy || event.status === 'Cancelled'} onClick={handleRegister}>
                {registered ? 'Cancel registration' : 'Join event'}
              </button>
            ) : null}
            <button className="button button--ghost" onClick={handleBookmark}>
              <Bookmark size={18} /> {bookmarkState ? 'Saved' : 'Save'}
            </button>
            <button className="button button--ghost" onClick={handleShare}>
              <Share2 size={18} /> Share
            </button>
            {isOwner ? (
              <>
                <Link className="button button--secondary" to={`/events/${event.id}/edit`}>
                  <Edit size={18} /> Edit
                </Link>
                <button className="button button--danger" disabled={busy || event.status === 'Cancelled'} onClick={handleCancelEvent}>
                  <XCircle size={18} /> Cancel event
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="card attendees-card">
        <h2>Attendees</h2>
        <div className="attendee-list">
          {attendees.length ? (
            attendees.map((attendee) => (
              <div className="attendee-item" key={attendee.id}>
                <img src={attendee.userPhotoURL || `https://ui-avatars.com/api/?name=${attendee.userName}`} alt={attendee.userName} />
                <div>
                  <strong>{attendee.userName}</strong>
                  <span>{attendee.userEmail}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No attendees yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default EventDetailsPage;
