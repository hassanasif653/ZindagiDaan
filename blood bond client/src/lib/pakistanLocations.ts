export interface Province {
  id: string;
  name: string;
}

export interface City {
  id: string;
  province_id: string;
  name: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toStringValue = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

const normalizeProvince = (value: unknown): Province | null => {
  if (!isObject(value)) return null;

  const id = toStringValue(value.id);
  const name = toStringValue(value.name);

  if (!id || !name) return null;
  return { id, name };
};

const normalizeCity = (value: unknown): City | null => {
  if (!isObject(value)) return null;

  const id = toStringValue(value.id);
  const provinceId = toStringValue(value.province_id);
  const name = toStringValue(value.name);

  if (!id || !provinceId || !name) return null;
  return { id, province_id: provinceId, name };
};

export const parseProvinces = (raw: unknown): Province[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => normalizeProvince(item))
    .filter((item): item is Province => item !== null);
};

export const parseCities = (raw: unknown): City[] => {
  if (Array.isArray(raw)) {
    const directCities = raw
      .map((item) => normalizeCity(item))
      .filter((item): item is City => item !== null);

    if (directCities.length > 0) {
      return directCities;
    }

    const tableEntry = raw.find(
      (item) =>
        isObject(item) &&
        item.type === "table" &&
        item.name === "cities" &&
        Array.isArray(item.data)
    );

    if (isObject(tableEntry) && Array.isArray(tableEntry.data)) {
      return tableEntry.data
        .map((item) => normalizeCity(item))
        .filter((item): item is City => item !== null);
    }
  }

  if (isObject(raw) && Array.isArray(raw.data)) {
    return raw.data
      .map((item) => normalizeCity(item))
      .filter((item): item is City => item !== null);
  }

  return [];
};

export const loadPakistanLocations = async (): Promise<{
  provinces: Province[];
  cities: City[];
}> => {
  const [provincesRes, citiesRes] = await Promise.all([
    fetch("/provinces.json"),
    fetch("/cities.json"),
  ]);

  const [provincesRaw, citiesRaw] = await Promise.all([
    provincesRes.json(),
    citiesRes.json(),
  ]);

  return {
    provinces: parseProvinces(provincesRaw),
    cities: parseCities(citiesRaw),
  };
};
