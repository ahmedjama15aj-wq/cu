/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCj4wpRl8J06dAP4Z59EPn_1PwcFXlkeyE',
  mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'Tc2ziFiH39qk4AyZmnloWVdSWnA=',
  recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''
};
export const COLORS = {
  primary: '#006D77', // Deep Green/Blue
  secondary: '#83C5BE', // Light Blue/Green
  accent: '#FFDDD2', // Soft Peach
  highlight: '#E29578', // Warm Orange
  yellow: '#FFD166', // Requested Yellow
  green: '#06D6A0', // Requested Green
  blue: '#118AB2', // Requested Blue
};

export const PAIN_POINTS: Array<{title: string, description: string, image?: string}> = [
  {
    title: "Back Pain",
    description: "Relieve chronic lower and upper back tension."
  },
  {
    title: "Migraines",
    description: "Reduce frequency and intensity of headaches."
  },
  {
    title: "Muscle Recovery",
    description: "Speed up recovery after intense physical activity."
  },
  {
    title: "Detoxification",
    description: "Remove toxins and improve blood circulation."
  }
];

export const INFO_CONTENT: Record<string, { title: string; content: string; type: 'therapy' | 'availability' | 'general' }> = {
  'Wet Cupping': {
    title: 'Wet Cupping (Hijamah)',
    content: 'Traditional method involving superficial incisions to draw out stagnant blood and toxins. It promotes deep detoxification, improves circulation, and boosts the immune system by removing metabolic waste from the tissues.',
    type: 'therapy'
  },
  'Sports Recovery': {
    title: 'Sports Recovery Cupping',
    content: 'Intensive session combining dry cupping, massage, and stretching for athletes. It helps in breaking up adhesions, stimulating lymphatic drainage, and providing deep tissue release to speed up recovery after intense physical activity.',
    type: 'therapy'
  },
  'Detox': {
    title: 'Detoxification Therapy',
    content: 'Cupping therapy pulls stagnant blood, metabolic waste, and toxins from deep tissues to the surface, where they are processed by the lymphatic system or removed through micro-incisions in wet cupping.',
    type: 'therapy'
  },
  'Acupuncture': {
    title: 'Acupuncture',
    content: 'A technique involving the insertion of thin needles into specific points on the body to balance energy flow (Qi), relieve pain, and treat various physical and mental conditions by stimulating the nervous system.',
    type: 'therapy'
  },
  'Pedicures': {
    title: 'Professional Pedicures',
    content: 'Full-service foot care including nail trimming, shaping, cuticle work, and callus removal, often followed by a relaxing foot massage and polish application.',
    type: 'therapy'
  },
  'Paraffin treatments': {
    title: 'Paraffin Wax Treatments',
    content: 'A therapeutic heat treatment that involves dipping hands or feet into warm paraffin wax to soften skin, improve circulation, and provide relief for joint pain and stiffness.',
    type: 'therapy'
  },
  'Beauty packages': {
    title: 'Complete Beauty Packages',
    content: 'Comprehensive sets of treatments that can include facials, manicures, pedicures, and body treatments tailored to rejuvenate and enhance your natural beauty.',
    type: 'therapy'
  },
  'Availability': {
    title: 'Practitioner Availability',
    content: 'This indicates the days the practitioner is available for appointments. Most practitioners operate between 9 AM and 6 PM on their active days. You can book a session on any of the highlighted days.',
    type: 'availability'
  },
  'Mon': { title: 'Monday Availability', content: 'Practitioner is available for bookings on Mondays. Standard hours are 9 AM - 6 PM.', type: 'availability' },
  'Tue': { title: 'Tuesday Availability', content: 'Practitioner is available for bookings on Tuesdays. Standard hours are 9 AM - 6 PM.', type: 'availability' },
  'Wed': { title: 'Wednesday Availability', content: 'Practitioner is available for bookings on Wednesdays. Standard hours are 9 AM - 6 PM.', type: 'availability' },
  'Thu': { title: 'Thursday Availability', content: 'Practitioner is available for bookings on Thursdays. Standard hours are 9 AM - 6 PM.', type: 'availability' },
  'Fri': { title: 'Friday Availability', content: 'Practitioner is available for bookings on Fridays. Standard hours are 9 AM - 6 PM.', type: 'availability' },
  'Sat': { title: 'Saturday Availability', content: 'Practitioner is available for bookings on Saturdays. Standard hours are 9 AM - 6 PM.', type: 'availability' },
  'Sun': { title: 'Sunday Availability', content: 'Practitioner is available for bookings on Sundays. Standard hours are 9 AM - 6 PM.', type: 'availability' },
};
