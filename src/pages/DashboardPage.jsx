import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, Compass, History, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardCounts, subscribeToEventsByOrganizer, subscribeToUserBookmarks, subscribeToUserRegistrations } from '../services/eventService';
import { subscribeToUserActivity } from '../services/activityService';
import { useFirestoreSubscription } from '../hooks/useFirestoreSubscription';
import SectionHeader from '../components/common/SectionHeader';
import EventGrid from '../components/events/EventGrid';
import { formatDateTime } from '../utils/formatters';

function DashboardPage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ createdCount: 0, joinedCount: 0 });

  const { data: createdEvents, loading: loadingCreated } = useFirestoreSubscription(
    (callback) => subscribeToEventsByOrganizer(user.uid, callback),
    [user.uid],
  );
  const { data: joinedEvents, loading: loadingJoined } = useFirestoreSubscription(
    (callback) => subscribeToUserRegistrations(user.uid, callback),
    [user.uid],
  );
  const { data: bookmarkedEvents, loading: loadingBookmarks } = useFirestoreSubscription(
    (callback) => subscribeToUserBookmarks(user.uid, callback),
    [user.uid],
  );
  const { data: activities, loading: loadingActivities } = useFirestoreSubscription(
    (callback) => subscribeToUserActivity(user.uid, callback),
    [user.uid],
  );

  useEffect(() => {
    fetchDashboardCounts(user.uid).then(setCounts);
  }, [createdEvents, joinedEvents, user.uid]);

  return (
    <div className="container page-section page-stack">
      <SectionHeader
        eyebrow="Workspace"
        title="Your event dashboard"
        description="Track owned events, joined events, bookmarks, and recent activity in one place."
        actions={
          <Link className="button button--primary" to="/create-event">
            <CalendarPlus size={18} /> New event
          </Link>
        }
      />

      <section className="dashboard-stats">
        <div className="stat-panel card"><CalendarPlus size={20} /><strong>{counts.createdCount}</strong><span>Events created</span></div>
        <div className="stat-panel card"><Ticket size={20} /><strong>{counts.joinedCount}</strong><span>Events joined</span></div>
        <div className="stat-panel card"><Compass size={20} /><strong>{bookmarkedEvents.length}</strong><span>Saved events</span></div>
        <div className="stat-panel card"><History size={20} /><strong>{activities.length}</strong><span>Activity logs</span></div>
      </section>

      <section className="page-stack">
        <SectionHeader title="Events you created" />
        <EventGrid events={createdEvents} loading={loadingCreated} emptyText="Your created events will appear here." />
      </section>

      <section className="page-stack">
        <SectionHeader title="Events you joined" />
        <EventGrid events={joinedEvents} loading={loadingJoined} emptyText="Join a public event to see it here." />
      </section>

      <section className="page-stack">
        <SectionHeader title="Bookmarked events" />
        <EventGrid events={bookmarkedEvents} loading={loadingBookmarks} emptyText="Save events for quick access later." />
      </section>

      <section className="card">
        <SectionHeader title="Recent activity" description="Each write action is tracked in a separate Firestore collection." />
        {loadingActivities ? (
          <p>Loading activity...</p>
        ) : activities.length ? (
          <div className="activity-list">
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div>
                  <strong>{activity.actionType}</strong>
                  <p>{activity.meta?.title || activity.eventId || 'Event action'}</p>
                </div>
                <span>{formatDateTime(activity.timestamp)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No activity yet.</p>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
