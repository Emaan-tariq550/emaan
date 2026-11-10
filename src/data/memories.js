
export const siteConfig = {
  name: 'Emaan',

  music: {
    src: '/music/background.mp3',
    title: 'Background Music',
  },

  about: {
    paragraphs: [
      "I'm someone who finds beauty in the little things, but I also love being the main character in my own story. I like capturing moments, admiring the details, taking pictures, and creating things that feel like me. I can be a little dramatic, a little obsessed with myself, and honestly, I think that's part of the charm. I love pretty things, good memories, random laughter, and anything that makes life feel a little more special. I'm still figuring things out, but I'm learning to enjoy every version of myself along the way.",
    ],

    // Required by AboutMe.jsx
    facts: [
      { label: 'BASED IN', value: 'Pakistan' },
      { label: 'LOVES', value: 'Pretty little things' },
      { label: 'CURRENTLY', value: 'Making memories' },
    ],
  },
}

// ============================================================
// MY WORLD (Chapter 4)
// ============================================================

export const worldTopics = [
  {
    id: 'places',
    label: 'My Places',
    title: 'Places that feel like home',
    image: '/images/world-places.jpg',
    text: 'Some places have a special kind of magic. They hold memories, bring peace, and make me feel like myself.',
    items: ['Beautiful places', 'Favourite corners', 'Dream destinations'],
  },
  {
    id: 'hobbies',
    label: 'Time Pass',
    title: 'What I do for the joy of it',
    image: '/images/world-hobbies.jpg',
    text: 'I love doing things that make ordinary days feel a little more interesting.',
    items: ['Taking pictures', 'Watching videos', 'Exploring creative ideas'],
  },
  {
    id: 'lifestyle',
    label: 'My Lifestyle',
    title: 'The rhythm of my days',
    image: '/images/world-lifestyle.jpg',
    text: 'A little chaos, a little comfort, and lots of little moments that make my days mine.',
    items: ['Slow mornings', 'Getting ready', 'Late-night thoughts'],
  },
  {
    id: 'little-things',
    label: 'Little Things',
    title: 'Tiny details I adore',
    image: '/images/world-little.jpg',
    text: 'I find happiness in the smallest details. Sometimes it is the little things that make everything special.',
    items: ['Pretty sunsets', 'Aesthetic pictures', 'Unexpected compliments'],
  },
  {
    id: 'classical',
    label: 'Classical',
    title: 'A little old-school soul',
    image: '/images/world-wishlist.jpg',
    text: 'There is something beautiful about timeless things, classic beauty, and moments that never go out of style.',
    items: ['Classical music', 'Timeless fashion', 'Vintage aesthetics'],
  },
  {
    id: 'happiness',
    label: 'Aman Sisi',
    title: 'Simple happiness',
    image: '/images/world-happy.jpg',
    text: 'The little things that instantly make my day better and put a smile on my face.',
    items: ['Random laughter', 'Favourite people', 'Beautiful memories'],
  },
]

// ============================================================
// ACHIEVEMENTS TIMELINE (Chapter 6)
// ============================================================

export const milestones = [
  {
    year: '2019',
    category: 'Competition',
    title: 'Secured First Position in Kangaroo Contest',
    text: 'A memorable achievement that made me proud of my efforts.',
  },
  {
    year: '2025',
    category: 'Achievement',
    title: 'Secured Second Position in Tech Hunt',
    text: 'A special moment that celebrated my creativity and hard work.',
  },
  {
    year: '2026',
    category: 'Recognition',
    title: 'Diamond Tier Recognition in AI Engineering Foundation Cohort 1',
    text: 'A proud milestone and recognition of my journey in AI engineering.',
  },
]
