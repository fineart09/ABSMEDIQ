const EMPTY_TH_ADDRESS_DATA = {
  provinces: [],
  districts: [],
  subDistricts: [],
};

let thaiAddressDataCache = null;
let thaiAddressDataPromise = null;

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
};

export const loadThaiAddressData = async () => {
  if (thaiAddressDataCache) {
    return thaiAddressDataCache;
  }

  if (thaiAddressDataPromise) {
    return thaiAddressDataPromise;
  }

  thaiAddressDataPromise = Promise.all([
    fetchJson('/data/th-provinces.json'),
    fetchJson('/data/th-districts.json'),
    fetchJson('/data/th-sub-districts.json'),
  ])
    .then(([provinces, districts, subDistricts]) => {
      thaiAddressDataCache = {
        provinces: Array.isArray(provinces) ? provinces : [],
        districts: Array.isArray(districts) ? districts : [],
        subDistricts: Array.isArray(subDistricts) ? subDistricts : [],
      };
      return thaiAddressDataCache;
    })
    .catch((error) => {
      thaiAddressDataPromise = null;
      throw error;
    });

  return thaiAddressDataPromise;
};

export const getEmptyThaiAddressData = () => ({
  provinces: [],
  districts: [],
  subDistricts: [],
});
