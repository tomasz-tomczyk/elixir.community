// Reads the colours at the top and bottom edges of an image, so a box around
// the image can use the same background. Returns a CSS background, or
// undefined when the edges are transparent. Like LocalImage, it reads
// /images/... from src/assets/images, else from public/.
import { existsSync } from 'node:fs'
import sharp from 'sharp'

const cache = new Map<string, { top?: string; bottom?: string }>()

async function edges(src: string) {
  const cached = cache.get(src)
  if (cached) return cached
  const asset = src.replace('/images/', 'src/assets/images/')
  const { data, info } = await sharp(existsSync(asset) ? asset : `public${src}`)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  // Average the two corners of one row, 2px in to skip anti-aliasing.
  const row = (y: number) => {
    const at = (x: number) => (y * info.width + x) * 4
    const [a, b] = [at(2), at(info.width - 3)]
    if (data[a + 3] < 255 || data[b + 3] < 255) return undefined
    const mix = [0, 1, 2].map((c) =>
      Math.round((data[a + c] + data[b + c]) / 2),
    )
    return `rgb(${mix.join(' ')})`
  }
  const result = { top: row(2), bottom: row(info.height - 3) }
  cache.set(src, result)
  return result
}

// `split` puts a hard stop in the middle. Use it when the gaps are above and
// below the image, so each gap matches its own edge exactly. Without it, the
// colour fades from top to bottom, which suits gaps at the sides.
export async function edgeBackground(src: string, { split = false } = {}) {
  const { top, bottom } = await edges(src)
  if (!top || !bottom) return undefined
  if (top === bottom) return top
  return split
    ? `linear-gradient(${top} 50%, ${bottom} 50%)`
    : `linear-gradient(${top}, ${bottom})`
}
