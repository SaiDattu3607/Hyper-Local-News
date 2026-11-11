import { Link } from 'react-router-dom';
import { DISTRICTS, STATE_TE, editionPath, type StateName } from '../data/districts';

const STATES: StateName[] = ['Telangana', 'Andhra Pradesh'];

/** Every district as a plain link list: the map's touch- and screen-reader-friendly twin. */
export default function DistrictIndex({ state }: { state?: StateName }) {
  const states = state ? [state] : STATES;
  return (
    <details className="dindex">
      <summary>All {state ? DISTRICTS.filter((d) => d.state === state).length : DISTRICTS.length} districts, A to Z</summary>
      {states.map((s) => (
        <div key={s} className="dindex__state">
          <h3 className="dindex__head">{s} <span className="te" lang="te">{STATE_TE[s]}</span></h3>
          <ul>
            {DISTRICTS.filter((d) => d.state === s)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((d) => (
                <li key={d.name}><Link to={editionPath(d)}>{d.name}</Link></li>
              ))}
          </ul>
        </div>
      ))}
    </details>
  );
}
