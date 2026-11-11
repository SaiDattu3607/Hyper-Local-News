import type { ReactNode } from 'react';

/** Column-shaped placeholders while stories load. */
export function ColumnSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="skeleton" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton__story">
          <i style={{ width: '30%' }} />
          <i style={{ width: '92%' }} />
          <i style={{ width: '70%' }} />
          <i style={{ width: '40%' }} />
        </div>
      ))}
    </div>
  );
}

export function Notice({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="notice" role="status">
      <p className="notice__title">{title}</p>
      {children && <div className="notice__body">{children}</div>}
    </div>
  );
}

export function ServerDown({ message }: { message?: string }) {
  return (
    <Notice title="The presses have stopped">
      <p>{message ?? 'The news server could not be reached.'} Start it with <code>npm run dev</code> in the project folder and make sure MongoDB is running, then reload this page.</p>
    </Notice>
  );
}
