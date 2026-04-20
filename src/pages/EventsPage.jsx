import { useMemo, useState } from 'react';
import { subscribeToEvents } from '../services/eventService';
import { useFirestoreSubscription } from '../hooks/useFirestoreSubscription';
import EventFilters from '../components/events/EventFilters';
import EventGrid from '../components/events/EventGrid';
import SectionHeader from '../components/common/SectionHeader';

function EventsPage() {
  const { data: events, loading } = useFirestoreSubscription(subscribeToEvents, []);
  const [filters, setFilters] = useState({ search: '', category: '', status: '', date: '' });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category ? event.category === filters.category : true;
      const matchesStatus = filters.status ? event.status === filters.status : true;
      const matchesDate = filters.date ? event.dateTime?.slice(0, 10) === filters.date : true;
      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });
  }, [events, filters]);

  return (
    <div className="container page-section page-stack">
      <SectionHeader
        eyebrow="Discover"
        title="Browse all public events"
        description="Search and filter by category, date, and live event status."
      />
      <EventFilters filters={filters} onChange={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))} />
      <EventGrid events={filteredEvents} loading={loading} />
    </div>
  );
}

export default EventsPage;
