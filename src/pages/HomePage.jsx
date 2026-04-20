import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { subscribeToFeaturedEvents } from '../services/eventService';
import { useFirestoreSubscription } from '../hooks/useFirestoreSubscription';
import SectionHeader from '../components/common/SectionHeader';
import EventGrid from '../components/events/EventGrid';

function HomePage() {
  const { data: featuredEvents, loading } = useFirestoreSubscription(subscribeToFeaturedEvents, []);

  return (
    <div className="page-stack">
      <section className="hero container">
        <div className="hero__content">
          <p className="eyebrow">Realtime event operations</p>
          <h1>Launch, manage, and grow events with a premium Firebase-powered platform.</h1>
          <p>
            Create events, drive registrations, track attendance, and manage your activity history from a single,
            responsive dashboard.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" to="/events">
              Explore events <ArrowRight size={18} />
            </Link>
            <Link className="button button--ghost" to="/create-event">
              Create an event
            </Link>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <CalendarDays size={20} />
              <strong>Realtime events</strong>
              <span>Live Firestore-backed updates</span>
            </div>
            <div className="stat-card">
              <Users size={20} />
              <strong>Registrations</strong>
              <span>Track attendees and joins</span>
            </div>
            <div className="stat-card">
              <ShieldCheck size={20} />
              <strong>Secure access</strong>
              <span>Role-aware ownership rules</span>
            </div>
          </div>
        </div>
        <div className="hero__panel card card--glass">
          <div className="hero-panel__badge">
            <Sparkles size={16} /> SaaS-grade UX
          </div>
          <h3>Everything flows through Firebase</h3>
          <ul className="feature-list">
            <li>Auth with email/password and Google login</li>
            <li>Firestore-powered event catalog, filters, history, and dashboards</li>
            <li>Storage-backed profile photos and event banners</li>
            <li>Dynamic profile, bookmarking, and registration flows</li>
          </ul>
        </div>
      </section>

      <section className="container page-section">
        <SectionHeader
          eyebrow="Featured"
          title="Fresh public events"
          description="Live events flow in directly from Firestore with no hardcoded content."
          actions={
            <Link className="button button--ghost" to="/events">
              View all
            </Link>
          }
        />
        <EventGrid events={featuredEvents} loading={loading} emptyText="Create the first event to populate the experience." />
      </section>
    </div>
  );
}

export default HomePage;
