import type { Metadata } from 'next';
import { ApparelExperience } from '@/components/ApparelExperience';

export const metadata: Metadata = {
  title: 'Apparel — COLLECTION 001 / EVERYDAY OBJECTS — ATMOS',
  description:
    'Not proof-of-fandom gear. Taste-signaling essentials engineered in Seoul, made for everywhere. 100% organic cotton, 260 GSM, and garment-washed cotton twill. Cut to feel like it has always been yours.',
  openGraph: {
    title: 'Apparel — COLLECTION 001 / EVERYDAY OBJECTS — ATMOS',
    description: 'Taste-signaling essentials engineered in Seoul, made for everywhere.',
    type: 'website',
    images: ['/images/atmos-campaign.jpg'],
  },
};

export default function ApparelPage() {
  return <ApparelExperience />;
}
