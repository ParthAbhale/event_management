import { format } from 'date-fns';

export function formatDateTime(dateString) {
  if (!dateString) return 'Date not available';

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString?.toDate?.() || new Date(dateString);
  return format(date, 'PPP • p');
}

export function getStatusTone(status) {
  const map = {
    Upcoming: 'status status--upcoming',
    Ongoing: 'status status--ongoing',
    Completed: 'status status--completed',
    Cancelled: 'status status--cancelled',
  };
  return map[status] || 'status';
}
