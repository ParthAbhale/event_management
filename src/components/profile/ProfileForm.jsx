import { useState } from 'react';

function ProfileForm({ profile, onSubmit, loading }) {
  const [name, setName] = useState(profile?.name || '');
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name, file });
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="profile-editor">
        <img className="profile-editor__avatar" src={profile?.photoURL} alt={profile?.name} />
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="avatar">Profile image</label>
            <input id="avatar" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={profile?.email || ''} disabled />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="button button--primary" disabled={loading} type="submit">
          {loading ? 'Updating...' : 'Update profile'}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
