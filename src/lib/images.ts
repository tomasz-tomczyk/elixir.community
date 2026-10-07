import { getCollection } from 'astro:content'
const people = await getCollection('people')
export const personImages = Object.fromEntries(
  people.map((p) => [p.data.name, p.data.image]),
)
