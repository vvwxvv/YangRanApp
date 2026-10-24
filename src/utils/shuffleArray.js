"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

const DEFAULT_INTERVAL_MS = 3500;

/**
 * Fisher–Yates shuffle, non-mutating. Inlined here instead of importing
 * from @/utils/shuffleArray to avoid depending on that module's export
 * shape (named vs default vs different signature).
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * useRandomArtworkImage
 *
 * Idle-state companion to useArtistHoverImage. While nothing is hovered,
 * this rotates through a shuffled, no-repeat queue of artists (each with
 * a cover_img_url) so consecutive images always come from a DIFFERENT
 * artist — never the same artist twice in a row, even across a reshuffle.
 *
 * Pass `paused: true` while the user is actively hovering a name, so the
 * rotation timer doesn't keep firing (and swap the image) underneath the
 * hover preview.
 *
 * Returns:
 *   randomArtist – the profile currently shown (or null if no eligible artists)
 *   randomImage  – randomArtist's cover_img_url (or null)
 */
export function useRandomArtworkImage(
  allProfiles,
  { paused = false, intervalMs = DEFAULT_INTERVAL_MS } = {}
) {
  // Only artists that actually have a cover image are eligible.
  const eligible = useMemo(
    () => (Array.isArray(allProfiles) ? allProfiles.filter((p) => p?.image) : []),
    [allProfiles]
  );

  const queueRef = useRef([]);
  const lastNameRef = useRef(null);
  const [randomProfile, setRandomProfile] = useState(null);

  const drawNext = useCallback(() => {
    if (eligible.length === 0) {
      setRandomProfile(null);
      return;
    }
    if (eligible.length === 1) {
      setRandomProfile(eligible[0]);
      lastNameRef.current = eligible[0].name;
      return;
    }
    if (queueRef.current.length === 0) {
      let shuffled = shuffle(eligible);
      // Avoid showing the same artist twice back-to-back across the
      // reshuffle seam (end of one cycle → start of the next).
      if (shuffled[0]?.name === lastNameRef.current) {
        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
      }
      queueRef.current = shuffled;
    }
    const next = queueRef.current.shift();
    lastNameRef.current = next.name;
    setRandomProfile(next);
  }, [eligible]);

  // (Re)start the queue whenever the eligible artist set changes shape
  // (e.g. language toggle swaps the whole artwork list).
  useEffect(() => {
    queueRef.current = [];
    drawNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligible.length]);

  // Rotate on an interval while not paused.
  useEffect(() => {
    if (paused || eligible.length <= 1) return;
    const id = setInterval(drawNext, intervalMs);
    return () => clearInterval(id);
  }, [paused, eligible.length, intervalMs, drawNext]);

  return {
    randomArtist: randomProfile,
    randomImage: randomProfile?.image || null,
  };
}