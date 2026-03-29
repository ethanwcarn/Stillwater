export type Therapist = {
  id: number
  name: string
  credentials: string
  bio: string
  faith_tradition: string
  photo_url: string
  specialties: string[]
}

export const featuredTherapists: Therapist[] = [
  {
    id: 1,
    name: 'Dr. Amanda Chen',
    credentials: 'Ph.D. Clinical Psychology',
    bio: 'Mindfulness-centered therapist integrating Buddhist philosophy with evidence-based practices.',
    faith_tradition: 'Buddhism',
    photo_url: '/therapists/amanda.jpg',
    specialties: ['Anxiety', 'Mindfulness', 'Grief', 'Stress Management'],
  },
  {
    id: 2,
    name: 'Sophia Williams, LCSW',
    credentials: 'MSW, Licensed Clinical Social Worker',
    bio: 'Faith-forward counselor specializing in family dynamics and spiritual growth.',
    faith_tradition: 'Christianity',
    photo_url: '/therapists/sophia.jpg',
    specialties: ['Relationships', 'Family', 'Depression', 'Spiritual Growth'],
  },
  {
    id: 3,
    name: 'Marcus Johnson, Ph.D.',
    credentials: 'Ph.D. Counseling Psychology',
    bio: 'Culturally sensitive therapist blending Islamic values with modern psychology.',
    faith_tradition: 'Islam',
    photo_url: '/therapists/marcus.jpg',
    specialties: ['Depression', 'Identity', 'Anxiety', 'Cultural Adjustment'],
  },
  {
    id: 4,
    name: 'Jeanine Torres, LPC',
    credentials: 'M.A. Clinical Mental Health Counseling, LPC',
    bio: 'Warm, empathetic counselor drawing on Jewish wisdom traditions for healing.',
    faith_tradition: 'Judaism',
    photo_url: '/therapists/jeanine.jpg',
    specialties: ['Grief', 'Anxiety', 'Life Transitions', 'Relationships'],
  },
  {
    id: 5,
    name: 'Priya Sharma, Psy.D.',
    credentials: 'Psy.D., Licensed Psychologist',
    bio: 'Holistic therapist combining Hindu philosophy with psychodynamic therapy.',
    faith_tradition: 'Hinduism',
    photo_url: '/therapists/priya.jpg',
    specialties: ['Stress Management', 'Self-Discovery', 'Anxiety', 'Mindfulness'],
  },
]
