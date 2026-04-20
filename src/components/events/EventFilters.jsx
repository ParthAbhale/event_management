import { EVENT_CATEGORIES, EVENT_STATUSES } from '../../utils/constants';

function EventFilters({ filters, onChange }) {
  return (
    <div className="filters-panel card">
      <div className="form-group grow">
        <label htmlFor="search">Search title</label>
        <input
          id="search"
          type="text"
          placeholder="Search events"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" value={filters.category} onChange={(event) => onChange('category', event.target.value)}>
          <option value="">All categories</option>
          {EVENT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select id="status" value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
          <option value="">All statuses</option>
          {EVENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={filters.date} onChange={(event) => onChange('date', event.target.value)} />
      </div>
    </div>
  );
}

export default EventFilters;
