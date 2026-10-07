// Fixed values for the small section pictures (src/components/TilePic.astro),
// so every build looks the same.

// Events: two weeks of days. 'm' is a meetup, 'c' is the conference.
export const calendar = [
  '',
  '',
  'm',
  '',
  '',
  'm',
  '',
  '',
  '',
  'c',
  '',
  '',
  'm',
  '',
]

// Resources: a few links of different lengths, in rem.
export const linkWidths = [3.2, 5, 2.4, 4, 4.6, 2.8, 3.6, 5.4, 2.2, 3]

// Podcasts: a waveform. Each bar moves between two heights.
export const wave = Array.from({ length: 26 }, (_, i) => {
  const low =
    0.3 +
    0.4 *
      Math.abs(Math.sin(i * 0.7)) *
      (0.6 + 0.4 * Math.abs(Math.cos(i * 1.9)))
  return {
    low,
    high: Math.min(1, low + 0.08 + 0.12 * Math.abs(Math.sin(i * 2.3))),
    delay: -((i * 2.7) % 7),
  }
})

// Books: [width px, height, opacity, tilt deg].
export const spines = [
  [11, 0.92, 0.3, 0],
  [9, 0.84, 0.45, 0],
  [14, 1, 0.25, 0],
  [10, 0.88, 0.35, 0],
  [12, 0.8, 0.5, 0],
  [9, 0.95, 0.3, 0],
  [13, 0.86, 0.4, 0],
  [10, 0.9, 0.28, 0],
  [11, 0.82, 0.38, 14],
  [16, 0.97, 0.3, 0],
  [10, 0.87, 0.45, 0],
  [12, 0.93, 0.32, 0],
  [9, 0.85, 0.4, -12],
  [14, 0.9, 0.55, 0],
] as const

// People: two staggered rows of faces, as [x %, y %].
export const faceSpots = [
  [18, 30],
  [41, 30],
  [64, 30],
  [87, 30],
  [29.5, 70],
  [52.5, 70],
  [75.5, 70],
] as const

// Companies: building heights in the skyline, in %.
export const buildings = [66, 88, 52, 76, 100]
