const BENGALURU_BOUNDS = "12.74,77.35,13.18,77.88";

const GAZETTEER = [
  ["BTM Layout", "BTM Layout, Bengaluru, Karnataka", 12.9166, 77.6101],
  ["BTM 2nd Stage", "BTM 2nd Stage, Bengaluru, Karnataka", 12.9163, 77.6107],
  ["Hebbal Flyover", "Bellary Road, Hebbal, Bengaluru", 13.0358, 77.5970],
  ["MG Road", "Mahatma Gandhi Road, Bengaluru", 12.9756, 77.6050],
  ["Whitefield", "Whitefield, Bengaluru", 12.9698, 77.7500],
  ["M Chinnaswamy Stadium", "Cubbon Road, Shivaji Nagar, Bengaluru", 12.9788, 77.5996],
  ["Sree Kanteerava Stadium", "Kasturba Road, Bengaluru", 12.9698, 77.5959],
  ["Palace Grounds", "Jayamahal, Bengaluru", 12.9981, 77.5926],
  ["Silk Board Junction", "Hosur Road, BTM Layout, Bengaluru", 12.9177, 77.6238],
  ["Koramangala", "Koramangala, Bengaluru", 12.9352, 77.6245],
  ["Indiranagar", "Indiranagar, Bengaluru", 12.9784, 77.6408],
  ["Jayanagar", "Jayanagar, Bengaluru", 12.9250, 77.5938],
  ["JP Nagar", "JP Nagar, Bengaluru", 12.9063, 77.5857],
  ["Banashankari", "Banashankari, Bengaluru", 12.9255, 77.5468],
  ["Majestic", "Kempegowda Bus Station, Bengaluru", 12.9767, 77.5713],
  ["KR Puram", "Krishnarajapuram, Bengaluru", 13.0075, 77.6951],
  ["Marathahalli", "Marathahalli, Bengaluru", 12.9569, 77.7011],
  ["Bellandur", "Bellandur, Bengaluru", 12.9304, 77.6784],
  ["HSR Layout", "HSR Layout, Bengaluru", 12.9121, 77.6446],
  ["Electronic City", "Electronic City, Bengaluru", 12.8452, 77.6602],
  ["Manyata Tech Park", "Nagavara, Bengaluru", 13.0500, 77.6200],
  ["Yelahanka", "Yelahanka, Bengaluru", 13.1007, 77.5963],
  ["Peenya", "Peenya Industrial Area, Bengaluru", 13.0285, 77.5197],
  ["Rajajinagar", "Rajajinagar, Bengaluru", 12.9915, 77.5545],
  ["Malleswaram", "Malleshwaram, Bengaluru", 13.0031, 77.5643],
  ["Basavanagudi", "Basavanagudi, Bengaluru", 12.9417, 77.5755],
  ["Lalbagh Botanical Garden", "Lalbagh Road, Bengaluru", 12.9507, 77.5848],
  ["Cubbon Park", "Kasturba Road, Bengaluru", 12.9763, 77.5929],
  ["Varthur Road", "Varthur Road, Bengaluru", 12.9560, 77.7210],
  ["Sarjapur Road", "Sarjapur Main Road, Bengaluru", 12.9081, 77.6854],
  ["Outer Ring Road", "ORR, Bengaluru", 12.9516, 77.6993],
  ["Kempegowda International Airport", "KIAL, Devanahalli, Bengaluru", 13.1986, 77.7066],
];

const norm = (value = "") => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function localMatches(query) {
  const q = norm(query);
  if (!q) return GAZETTEER.slice(0, 6).map(toResult);
  const tokens = q.split(" ").filter(Boolean);
  return GAZETTEER
    .map((place) => {
      const hay = norm(`${place[0]} ${place[1]}`);
      let score = hay.startsWith(q) ? 40 : hay.includes(q) ? 25 : 0;
      score += tokens.filter((t) => hay.includes(t) || initials(hay).includes(t)).length * 8;
      if (q === "btm" || q.includes("btm")) score += place[0].toLowerCase().includes("btm") ? 30 : 0;
      return { place, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => toResult(x.place));
}

function initials(text) {
  return text.split(" ").map((word) => word[0] || "").join("");
}

function toResult([name, address, lat, lng]) {
  return { name, address, lat, lng, source: "Mappls Bengaluru Gazetteer" };
}

function dedupe(results) {
  const seen = new Set();
  return results.filter((r) => {
    const key = `${norm(r.name)}:${Number(r.lat).toFixed(4)}:${Number(r.lng).toFixed(4)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Number.isFinite(r.lat) && Number.isFinite(r.lng);
  });
}

async function nominatim(query) {
  if (!query || query.trim().length < 2) return [];
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "8");
  url.searchParams.set("countrycodes", "in");
  url.searchParams.set("viewbox", BENGALURU_BOUNDS);
  url.searchParams.set("bounded", "1");
  url.searchParams.set("q", /bengaluru|bangalore/i.test(query) ? query : `${query}, Bengaluru`);

  const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!response.ok) return [];
  const rows = await response.json();
  return rows.map((row) => ({
    name: row.name || row.display_name?.split(",")[0] || query,
    address: row.display_name || "Bengaluru, Karnataka",
    lat: Number(row.lat),
    lng: Number(row.lon),
    source: "OSM Nominatim",
  }));
}

export async function getToken() {
  return { status: "live", provider: "Mappls-compatible Bengaluru search" };
}

export async function geocode(query) {
  const local = localMatches(query);
  try {
    const live = await nominatim(query);
    return dedupe([...local, ...live]).slice(0, 8);
  } catch (_) {
    return local;
  }
}

export async function distanceMatrix(points = []) {
  if (points.length < 2) return { distanceKm: 0, durationMin: 0 };
  const [a, b] = points;
  const distanceKm = haversine(a.lat, a.lng, b.lat, b.lng);
  return { distanceKm, durationMin: Math.round((distanceKm / 22) * 60) };
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(x)) * 10) / 10;
}