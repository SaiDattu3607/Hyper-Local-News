export type StateName = 'Telangana' | 'Andhra Pradesh';

export interface District {
  /** Exactly as the API stores it (src/utils/districtClassifier.js). */
  name: string;
  state: StateName;
  /** Telugu name. Please have a native speaker review these. */
  te: string;
  /** Three-letter tile label. */
  code: string;
  /** Tile position on the map grid: column, row. Roughly geographic. */
  col: number;
  row: number;
}

const ts = (name: string, te: string, code: string, col: number, row: number): District =>
  ({ name, state: 'Telangana', te, code, col, row });
const ap = (name: string, te: string, code: string, col: number, row: number): District =>
  ({ name, state: 'Andhra Pradesh', te, code, col, row });

export const DISTRICTS: District[] = [
  ts('Adilabad', 'ఆదిలాబాద్', 'ADB', 2, 0),
  ts('Kumuram Bheem', 'కుమురం భీం', 'KMB', 3, 0),
  ts('Nizamabad', 'నిజామాబాద్', 'NZB', 1, 1),
  ts('Nirmal', 'నిర్మల్', 'NML', 2, 1),
  ts('Mancherial', 'మంచిర్యాల', 'MNC', 3, 1),
  ts('Kamareddy', 'కామారెడ్డి', 'KMR', 1, 2),
  ts('Jagtial', 'జగిత్యాల', 'JGT', 2, 2),
  ts('Peddapalli', 'పెద్దపల్లి', 'PDP', 3, 2),
  ts('Jayashankar Bhupalpally', 'జయశంకర్ భూపాలపల్లి', 'BHP', 4, 2),
  ts('Mulugu', 'ములుగు', 'MLG', 5, 2),
  ts('Medak', 'మెదక్', 'MDK', 1, 3),
  ts('Rajanna Sircilla', 'రాజన్న సిరిసిల్ల', 'SRC', 2, 3),
  ts('Karimnagar', 'కరీంనగర్', 'KRM', 3, 3),
  ts('Hanamkonda', 'హనుమకొండ', 'HNK', 4, 3),
  ts('Bhadradri Kothagudem', 'భద్రాద్రి కొత్తగూడెం', 'KTG', 5, 3),
  ts('Sangareddy', 'సంగారెడ్డి', 'SRD', 1, 4),
  ts('Siddipet', 'సిద్దిపేట', 'SDP', 2, 4),
  ts('Jangaon', 'జనగామ', 'JGN', 3, 4),
  ts('Warangal', 'వరంగల్', 'WGL', 4, 4),
  ts('Mahabubabad', 'మహబూబాబాద్', 'MBD', 5, 4),
  ts('Vikarabad', 'వికారాబాద్', 'VKB', 1, 5),
  ts('Medchal-Malkajgiri', 'మేడ్చల్-మల్కాజ్‌గిరి', 'MDL', 2, 5),
  ts('Yadadri Bhuvanagiri', 'యాదాద్రి భువనగిరి', 'BNG', 3, 5),
  ts('Suryapet', 'సూర్యాపేట', 'SRP', 4, 5),
  ts('Khammam', 'ఖమ్మం', 'KMM', 5, 5),
  ts('Rangareddy', 'రంగారెడ్డి', 'RRD', 1, 6),
  ts('Hyderabad', 'హైదరాబాద్', 'HYD', 2, 6),
  ts('Nalgonda', 'నల్గొండ', 'NLG', 3, 6),
  ts('Narayanpet', 'నారాయణపేట', 'NRP', 0, 7),
  ts('Mahabubnagar', 'మహబూబ్‌నగర్', 'MBN', 1, 7),
  ts('Nagarkurnool', 'నాగర్‌కర్నూల్', 'NGK', 2, 7),
  ts('Jogulamba Gadwal', 'జోగులాంబ గద్వాల', 'GDW', 0, 8),
  ts('Wanaparthy', 'వనపర్తి', 'WNP', 1, 8),

  ap('Parvathipuram Manyam', 'పార్వతీపురం మన్యం', 'PVM', 9, 1),
  ap('Srikakulam', 'శ్రీకాకుళం', 'SKL', 10, 1),
  ap('Alluri Sitharama Raju', 'అల్లూరి సీతారామరాజు', 'ASR', 8, 2),
  ap('Vizianagaram', 'విజయనగరం', 'VZM', 9, 2),
  ap('Anakapalli', 'అనకాపల్లి', 'AKP', 8, 3),
  ap('Visakhapatnam', 'విశాఖపట్నం', 'VSP', 9, 3),
  ap('Eluru', 'ఏలూరు', 'ELR', 6, 4),
  ap('East Godavari', 'తూర్పు గోదావరి', 'EGD', 7, 4),
  ap('Kakinada', 'కాకినాడ', 'KKD', 8, 4),
  ap('West Godavari', 'పశ్చిమ గోదావరి', 'WGD', 6, 5),
  ap('Konaseema', 'కోనసీమ', 'KNS', 7, 5),
  ap('NTR (Vijayawada)', 'ఎన్టీఆర్ (విజయవాడ)', 'NTR', 5, 6),
  ap('Krishna', 'కృష్ణా', 'KRS', 6, 6),
  ap('Palnadu', 'పల్నాడు', 'PLN', 3, 7),
  ap('Guntur', 'గుంటూరు', 'GNT', 4, 7),
  ap('Bapatla', 'బాపట్ల', 'BPT', 5, 7),
  ap('Nandyal', 'నంద్యాల', 'NDL', 2, 8),
  ap('Prakasam', 'ప్రకాశం', 'PKM', 3, 8),
  ap('Kurnool', 'కర్నూలు', 'KNL', 1, 9),
  ap('YSR Kadapa', 'వైఎస్ఆర్ కడప', 'KDP', 2, 9),
  ap('Sri Potti Sriramulu Nellore', 'శ్రీ పొట్టి శ్రీరాములు నెల్లూరు', 'NLR', 3, 9),
  ap('Ananthapuramu', 'అనంతపురం', 'ATP', 1, 10),
  ap('Annamayya', 'అన్నమయ్య', 'ANM', 2, 10),
  ap('Tirupati', 'తిరుపతి', 'TPT', 3, 10),
  ap('Sri Sathya Sai', 'శ్రీ సత్యసాయి', 'SSS', 1, 11),
  ap('Chittoor', 'చిత్తూరు', 'CTR', 2, 11)
];

export const GRID = {
  cols: Math.max(...DISTRICTS.map((d) => d.col)) + 1,
  rows: Math.max(...DISTRICTS.map((d) => d.row)) + 1
};

const byName = new Map(DISTRICTS.map((d) => [d.name, d]));
export const findDistrict = (name: string) => byName.get(name);

export const STATE_TE: Record<StateName, string> = {
  Telangana: 'తెలంగాణ',
  'Andhra Pradesh': 'ఆంధ్రప్రదేశ్'
};

/** URL slug <-> district name. */
export const slugOf = (name: string) =>
  name.toLowerCase().replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const bySlug = new Map(DISTRICTS.map((d) => [slugOf(d.name), d]));
export const fromSlug = (slug: string) => bySlug.get(slug);
export const stateSlug = (state: StateName) => (state === 'Telangana' ? 'telangana' : 'andhra-pradesh');
export const editionPath = (d: District) => `/${stateSlug(d.state)}/${slugOf(d.name)}`;
