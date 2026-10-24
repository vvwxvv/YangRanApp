/**
 * artistDataUtils.js
 * ──────────────────────────────────────────────────────────────
 * Pure utility functions for deriving artist-related data
 * from the Moodsea data models:
 *
 *   About.artist          →  canonical artist profile
 *   Artwork.artist        →  artist's artworks
 *   Exhibition.related_artist[] → artist's exhibitions
 *   Event.related_artist[] → artist's events
 *
 * All functions are pure — no React, no side effects.
 * ──────────────────────────────────────────────────────────────
 */

// ─── Matching helpers ────────────────────────────────────────

/**
 * Find all artworks by an artist. Matches on `artist` field.
 * Handles case-insensitive matching and whitespace normalization.
 */
export function matchArtworksByArtist(allArtworks, artistName) {
  if (!Array.isArray(allArtworks) || !artistName) return [];
  const key = normalizeName(artistName);
  return allArtworks
    .filter((aw) => normalizeName(aw?.artist) === key)
    .sort((a, b) => (Number(b?.year) || 0) - (Number(a?.year) || 0)); // newest first
}

/**
 * Find all exhibitions featuring an artist. Matches on `related_artist[]`.
 */
export function matchExhibitionsByArtist(allExhibitions, artistName) {
  if (!Array.isArray(allExhibitions) || !artistName) return [];
  const key = normalizeName(artistName);
  return allExhibitions
    .filter((ex) => {
      const list = ex?.related_artist;
      if (!Array.isArray(list)) return false;
      return list.some((name) => normalizeName(name) === key);
    })
    .sort((a, b) => (Number(b?.year) || 0) - (Number(a?.year) || 0));
}

/**
 * Find all events featuring an artist. Matches on `related_artist[]`.
 */
export function matchEventsByArtist(allEvents, artistName) {
  if (!Array.isArray(allEvents) || !artistName) return [];
  const key = normalizeName(artistName);
  return allEvents
    .filter((ev) => {
      const list = ev?.related_artist;
      if (!Array.isArray(list)) return false;
      return list.some((name) => normalizeName(name) === key);
    })
    .sort((a, b) => (Number(b?.year) || 0) - (Number(a?.year) || 0));
}

// ─── Normalization ───────────────────────────────────────────

/**
 * Normalize a name for comparison: trim, lowercase, collapse whitespace.
 */
export function normalizeName(name) {
  if (!name || typeof name !== "string") return "";
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

// ─── Artist profile builder ──────────────────────────────────

/**
 * Build a complete artist profile from About + related artworks/exhibitions/events.
 *
 * @param {Object} about - one About document (artist profile)
 * @param {Array} allArtworks
 * @param {Array} allExhibitions
 * @param {Array} allEvents
 * @returns {Object} { name, portrait_img_url, caption, introductions, artworks, exhibitions, events, totalWorks }
 */
export function buildArtistProfile(about, allArtworks, allExhibitions, allEvents) {
  const name = (about?.artist || "").trim();
  if (!name) return null;

  const artworks = matchArtworksByArtist(allArtworks, name);
  const exhibitions = matchExhibitionsByArtist(allExhibitions, name);
  const events = matchEventsByArtist(allEvents, name);

  return {
    name,
    portrait_img_url: about?.portrait_image_url || null,
    caption: about?.caption || null,
    introductions: Array.isArray(about?.introductions) ? about.introductions : [],
    artworks,
    exhibitions,
    events,
    totalWorks: artworks.length,
    totalExhibitions: exhibitions.length + events.length,
  };
}

/**
 * Build all artist profiles from About data.
 * Only returns artists that appear in About AND have at least one artwork or exhibition.
 *
 * @returns {Object[]} array of artist profile objects
 */
export function buildAllArtistProfiles(allAbouts, allArtworks, allExhibitions, allEvents) {
  if (!Array.isArray(allAbouts)) return [];

  return allAbouts
    .map((about) => buildArtistProfile(about, allArtworks, allExhibitions, allEvents))
    .filter(Boolean) // remove nulls
    .filter((p) => p.artworks.length > 0 || p.exhibitions.length > 0 || p.events.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name)); // A-Z
}

// ─── Grouping ────────────────────────────────────────────────

/**
 * Group artist profiles by first letter of name.
 * Returns [{ letter, profiles[] }] sorted A-Z, with "#" last.
 */
export function groupArtistsByLetter(profiles) {
  if (!Array.isArray(profiles)) return [];

  const map = new Map();
  for (const p of profiles) {
    const char = p.name[0]?.toUpperCase() || "?";
    const key = /^[A-Z]$/.test(char) ? char : "#";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  }

  const result = [];
  const keys = [...map.keys()].sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  for (const key of keys) {
    result.push({ letter: key, profiles: map.get(key) });
  }
  return result;
}

/**
 * Get a flat sorted list of all unique artist names from About.
 */
export function getArtistNames(allAbouts) {
  if (!Array.isArray(allAbouts)) return [];
  return [...new Set(
    allAbouts.map((a) => (a?.artist || "").trim()).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));
}
