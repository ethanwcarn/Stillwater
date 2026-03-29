export type Therapist = {
  id: number
  name: string
  credentials: string
  bio: string
  faith_tradition: string
  photo_url: string
  specialties: string[]
}

// Must stay in sync with IDs 1–5 in db/seed.sql
export const featuredTherapists: Therapist[] = [
  {
    id: 1,
    name: 'Dr. Elena Rivera',
    credentials: 'PhD, LPC',
    bio: 'Faith-integrated therapist with 15 years of experience supporting anxiety, depression, and grief.',
    faith_tradition: 'Christianity',
    photo_url: '/therapists/amanda.jpg',
    specialties: ['Anxiety', 'Depression', 'Grief'],
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    credentials: 'LCSW',
    bio: 'Provides culturally sensitive mental health support with attention to faith and community.',
    faith_tradition: 'Islam',
    photo_url: '/therapists/marcus.jpg',
    specialties: ['Trauma', 'Anxiety', 'Cultural Adjustment'],
  },
  {
    id: 3,
    name: 'Rachel Cohen',
    credentials: 'LCSW',
    bio: 'Works with individuals and families navigating grief and life transitions.',
    faith_tradition: 'Judaism',
    photo_url: '/therapists/jeanine.jpg',
    specialties: ['Grief', 'Family Therapy', 'Identity'],
  },
  {
    id: 4,
    name: 'Priya Patel',
    credentials: 'LMFT',
    bio: 'Supports couples and families with culturally aware and spiritually respectful care.',
    faith_tradition: 'Hinduism',
    photo_url: '/therapists/priya.jpg',
    specialties: ['Couples Counseling', 'Family Therapy', 'Life Transitions'],
  },
  {
    id: 5,
    name: 'Tenzin Dorje',
    credentials: 'PhD',
    bio: 'Uses mindfulness-based approaches to help manage stress and anxiety.',
    faith_tradition: 'Buddhism',
    photo_url: '/therapists/sophia.jpg',
    specialties: ['Mindfulness', 'Stress Management', 'Anxiety'],
  },
]
