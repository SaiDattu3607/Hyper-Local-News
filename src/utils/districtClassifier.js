export const TELANGANA_DISTRICTS = [
  'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad', 'Jagtial',
  'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy',
  'Karimnagar', 'Khammam', 'Kumuram Bheem', 'Mahabubabad', 'Mahabubnagar',
  'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool',
  'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli',
  'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet',
  'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
];

// Krishna and Kurnool complete the current 26-district AP list.
export const ANDHRA_PRADESH_DISTRICTS = [
  'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla',
  'Chittoor', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Konaseema',
  'Krishna', 'Kurnool', 'NTR (Vijayawada)', 'Nandyal', 'Palnadu',
  'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore',
  'Sri Sathya Sai', 'Srikakulam', 'Tirupati', 'Visakhapatnam', 'Vizianagaram',
  'West Godavari', 'YSR Kadapa'
];

const aliases = new Map([
  ['vijayawada', 'NTR (Vijayawada)'],
  ['ntr', 'NTR (Vijayawada)'],
  ['nellore', 'Sri Potti Sriramulu Nellore'],
  ['sps nellore', 'Sri Potti Sriramulu Nellore'],
  ['kadapa', 'YSR Kadapa'],
  ['ysr', 'YSR Kadapa'],
  ['ananthapur', 'Ananthapuramu'],
  ['anantapur', 'Ananthapuramu'],
  ['kumaram bheem', 'Kumuram Bheem'],
  ['rangareddy', 'Rangareddy']
]);

const normalizedDistricts = [...TELANGANA_DISTRICTS, ...ANDHRA_PRADESH_DISTRICTS]
  .sort((left, right) => right.length - left.length);

const normalize = (value = '') => value.toLowerCase().replace(/[(),.-]/g, ' ').replace(/\s+/g, ' ').trim();

export function classifyArticle(title = '', description = '') {
  const text = normalize(`${title} ${description}`);

  for (const district of normalizedDistricts) {
    const districtText = normalize(district);
    if (text.includes(districtText)) {
      return {
        state: TELANGANA_DISTRICTS.includes(district) ? 'Telangana' : 'Andhra Pradesh',
        district
      };
    }
  }

  for (const [alias, district] of aliases) {
    if (text.includes(alias)) {
      return {
        state: TELANGANA_DISTRICTS.includes(district) ? 'Telangana' : 'Andhra Pradesh',
        district
      };
    }
  }

  return { state: 'Unknown', district: 'General' };
}

export function getAllDistricts() {
  return { Telangana: TELANGANA_DISTRICTS, 'Andhra Pradesh': ANDHRA_PRADESH_DISTRICTS };
}
