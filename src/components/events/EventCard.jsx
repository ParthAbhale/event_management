import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, UserRound, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { cancelRegistration, isRegistered, registerForEvent } from '../../services/eventService';

export default function EventCard({ event }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [joining, setJoining] = useState(false);

  const date = event?.dateTime
    ? event.dateTime?.seconds
      ? new Date(event.dateTime.seconds * 1000)
      : new Date(event.dateTime)
    : null;

  const isOwner = useMemo(
    () => user?.uid && event?.organizer?.userId === user.uid,
    [event?.organizer?.userId, user?.uid],
  );

  useEffect(() => {
    let active = true;
    if (!user?.uid || !event?.id) {
      setRegistered(false);
      return undefined;
    }

    isRegistered(event.id, user.uid)
      .then((value) => {
        if (active) setRegistered(value);
      })
      .catch(() => {
        if (active) setRegistered(false);
      });

    return () => {
      active = false;
    };
  }, [event?.id, user?.uid]);

  const handleAttend = async () => {
    if (!event?.id) return;

    if (!user) {
      toast.error('Please login to attend events.');
      navigate('/auth');
      return;
    }

    if (isOwner) {
      toast('You are the organizer of this event.');
      return;
    }

    if (event.status === 'Cancelled') {
      toast.error('This event has been cancelled.');
      return;
    }

    setJoining(true);
    try {
      if (registered) {
        await cancelRegistration(event.id, user);
        setRegistered(false);
        toast.success('Attendance removed.');
      } else {
        await registerForEvent(event.id, user);
        setRegistered(true);
        toast.success('You are now attending this event.');
      }
    } catch (error) {
      toast.error(error.message || 'Could not update attendance.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <article className="event-compact-card group">
      <Link to={`/events/${event.id}`} className="event-compact-card__image-wrap">
        <div className="event-compact-card__image-shell">
          {event?.bannerImage ? (
            <img
              src={event.bannerImage}
              alt={event?.title || 'Event banner'}
              className="event-compact-card__image"
            />
          ) : (
            <div className="event-compact-card__empty">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="event-compact-card__content">
        <div className="event-compact-card__meta">
          <span className="pill">{event?.category || 'General'}</span>
          <span className={event?.status ? `status status--${event.status.toLowerCase()}` : 'status status--upcoming'}>
            {event?.status || 'Upcoming'}
          </span>
        </div>

        <Link to={`/events/${event.id}`} className="event-compact-card__title-link">
          <h3>{event?.title || 'Untitled Event'}</h3>
        </Link>

        <p className="event-compact-card__description">{event?.description || 'No description available'}</p>

        <div className="event-compact-card__details">
          <span>
            <CalendarDays size={14} />
            {date
              ? `${date.toLocaleDateString('en-GB')} • ${date.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}`
              : 'Date not available'}
          </span>
          <span>
            <MapPin size={14} />
            {event?.location || 'Location not available'}
          </span>
          <span>
            <Users size={14} />
            {event?.attendeeCount || 0} attendees
          </span>
          <span>
            <UserRound size={14} />
            {event?.organizer?.name || 'Unknown organizer'}
          </span>
        </div>

        <div className="event-compact-card__actions">
          <button
            type="button"
            onClick={handleAttend}
            disabled={joining || event?.status === 'Cancelled'}
            className={`button ${registered ? 'button--secondary' : 'button--primary'} event-compact-card__button`}
          >
            {joining ? 'Please wait...' : registered ? 'Cancel attendance' : 'Attend event'}
          </button>
          <Link to={`/events/${event.id}`} className="button button--ghost event-compact-card__button">
            View details
          </Link>
        </div>

        {!user ? (
          <p className="event-compact-card__hint">Login required to attend events.</p>
        ) : null}
      </div>
    </article>
  );
}