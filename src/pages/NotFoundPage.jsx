import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container page-section">
      <div className="empty-state card">
        <h1>404</h1>
        <p>The page you are looking for does not exist.</p>
        <Link className="button button--primary" to="/">
          Go home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
