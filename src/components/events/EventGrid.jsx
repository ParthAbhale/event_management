import EventCard from './EventCard';
import SkeletonCard from '../common/SkeletonCard';

function EventGrid({ events, loading, emptyTitle = 'No events found', emptyText = 'Try changing your filters or create a new event.' }) {
  if (loading) {
    return (
      <div className="event-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="empty-state">
        <h3>{emptyTitle}</h3>
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-5">
  {events.map((event) => (
    <EventCard key={event.id} event={event} />
  ))}
</div>
  );
}

export default EventGrid;
