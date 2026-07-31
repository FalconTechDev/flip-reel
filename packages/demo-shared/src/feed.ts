import type { Feed, Story } from '@flipatic/flip-reel'

const VIDEO_BASE = 'https://rj0pnqxhhfadsjab.public.blob.vercel-storage.com/videos/'
const POSTER_BASE = 'https://flip-reel-demo.vercel.app/posters/'

function videoStory(
  id: string,
  category: string,
  title: string,
  brand: string,
  date: string,
  file: string,
): Story {
  return {
    type: 'video',
    id,
    category,
    title,
    brand,
    date,
    video: `${VIDEO_BASE}${file}.mp4`,
    poster: `${POSTER_BASE}${file}.jpg`,
    link: 'https://example.com/article',
  }
}

export const demoFeed: Feed = {
  categories: [
    { id: 'poland', label: 'Poland' },
    { id: 'world', label: 'World' },
    { id: 'sport', label: 'Sport' },
    { id: 'travel', label: 'Travel' },
    { id: 'tech', label: 'Tech' },
    { id: 'lifestyle', label: 'Lifestyle' },
  ],
  stories: [
    videoStory(
      'poland-01',
      'poland',
      'Breaking: City council approves new transit plan',
      'Sarah Chen',
      '23 Apr',
      '13510402_1080_1920_30fps',
    ),
    videoStory(
      'world-02',
      'world',
      'Festival lineup announced today',
      'Marco Lindqvist',
      '22 Apr',
      '14736491_1080_1920_30fps',
    ),
    videoStory(
      'sport-01',
      'sport',
      'Championship final: last minute goal',
      'Tom Reeves',
      '22 Apr',
      '15669027_1080_1920_30fps',
    ),
    videoStory(
      'travel-01',
      'travel',
      'Weekend hiking trail you have not tried yet',
      'Olivia Hart',
      '21 Apr',
      '14985187_1080_1920_30fps',
    ),
    videoStory(
      'tech-01',
      'tech',
      'Behind the scenes of the new comedy series',
      'Jenna Ross',
      '21 Apr',
      '15058887_1080_1920_30fps',
    ),
    videoStory(
      'lifestyle-01',
      'lifestyle',
      '3 breakfast ideas for busy mornings',
      'Olivia Hart',
      '20 Apr',
      '14834426_2160_3840_30fps',
    ),
    videoStory(
      'poland-02',
      'poland',
      'Mayor unveils riverside park renovation',
      'Sarah Chen',
      '20 Apr',
      '14601834_2160_3840_30fps',
    ),
    videoStory(
      'world-01',
      'world',
      'Summit ends with landmark climate deal',
      'Marco Lindqvist',
      '19 Apr',
      '15357733_2160_3840_60fps',
    ),
    videoStory(
      'sport-02',
      'sport',
      'Underdogs stun the league leaders',
      'Tom Reeves',
      '19 Apr',
      '14732967_1080_1920_120fps',
    ),
    videoStory(
      'travel-02',
      'travel',
      'A slow morning in the old harbour town',
      'Olivia Hart',
      '18 Apr',
      '12500458_2160_3840_60fps',
    ),
    videoStory(
      'tech-02',
      'tech',
      'Hands-on with this season most hyped gadget',
      'Jenna Ross',
      '18 Apr',
      '13510402_1080_1920_30fps',
    ),
    videoStory(
      'lifestyle-02',
      'lifestyle',
      'Five minutes to a calmer evening routine',
      'Olivia Hart',
      '17 Apr',
      '14985187_1080_1920_30fps',
    ),
  ],
}
