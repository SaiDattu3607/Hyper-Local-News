import { Link } from 'react-router-dom';
import { Notice } from '../components/Status';

export default function NotFound() {
  return (
    <main className="wrap page">
      <Notice title="This page is not in today's edition">
        <p><Link to="/">Back to the front page</Link></p>
      </Notice>
    </main>
  );
}
