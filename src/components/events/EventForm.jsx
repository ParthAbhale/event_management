import { useState } from 'react';
import { EVENT_CATEGORIES, EVENT_STATUSES } from '../../utils/constants';

function EventForm({ initialValues, onSubmit, loading, requireBanner = false }) {
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    location: initialValues?.location || '',
    dateTime: initialValues?.dateTime || '',
    category: initialValues?.category || EVENT_CATEGORIES[0],
    status: initialValues?.status || 'Upcoming',
    bannerFile: null,
    currentBanner: initialValues?.bannerImage || '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="form-grid two-columns">
        <div className="form-group">
          <label htmlFor="title">Event title</label>
          <input id="title" required value={form.title} onChange={(e) => handleChange('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location / map link</label>
          <input id="location" required value={form.location} onChange={(e) => handleChange('location', e.target.value)} />
        </div>
        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            required
            rows="6"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateTime">Date & time</label>
          <input
            id="dateTime"
            required
            type="datetime-local"
            value={form.dateTime}
            onChange={(e) => handleChange('dateTime', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
            {EVENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="bannerFile">Banner image</label>
          <input id="bannerFile" type="file" accept="image/*" required={requireBanner && !form.currentBanner} onChange={(e) => handleChange('bannerFile', e.target.files?.[0] || null)} />
        </div>
      </div>

      {form.currentBanner ? <img className="banner-preview" src={form.currentBanner} alt="Current banner" /> : null}

      <div className="form-actions">
        <button className="button button--primary" disabled={loading} type="submit">
          {loading ? 'Saving...' : 'Save event'}
        </button>
      </div>
    </form>
  );
}

export default EventForm;
