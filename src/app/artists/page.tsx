import type { Metadata } from 'next';
import { ArtistsExperience } from '../../components/ArtistsExperience';

export const metadata: Metadata = {
  title: 'ATMOS / ARTISTS — The Voices',
  description:
    'The creative roster of ATMOS. Five voices shaped by Seoul, Tokyo, London, California, and Bangkok, crossing in one room.',
  openGraph: {
    title: 'ATMOS / ARTISTS — The Voices',
    description:
      'The creative roster of ATMOS. Five voices shaped by Seoul, Tokyo, London, California, and Bangkok, crossing in one room.',
    images: [{ url: '/images/atmos-hero.jpg', width: 1200, height: 630, alt: 'ATMOS Artists Roster' }],
  },
};

export default function ArtistsPage() {
  return <ArtistsExperience />;
}
