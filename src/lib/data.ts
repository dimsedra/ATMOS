export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  color: string;
  image: string;
  sizes: string[];
  description: string;
  details: string[];
};

export type CartItem = { productId: string; size: string; quantity: number };

export const products: Product[] = [
  {
    id: 'everyday-tee',
    name: 'The Everyday Tee',
    category: 'HEAVYWEIGHT COTTON',
    price: 58,
    color: 'Bone',
    image: '/images/atmos-tee.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'A little more room. A little more weight. The one you reach for, on repeat. Our first everyday essential, cut to feel like it has always been yours.',
    details: ['100% organic cotton, 260 GSM', 'Relaxed, boxy fit with dropped shoulders', 'Subtle chest print and ribbed neckline', 'Designed in Seoul. Made for everywhere.'],
  },
  {
    id: 'studio-cap',
    name: 'The Studio Cap',
    category: 'WASHED COTTON TWILL',
    price: 38,
    color: 'Faded black',
    image: '/images/atmos-cap.jpg',
    sizes: ['One size'],
    description: 'For late studio nights and the morning after. An unstructured six-panel cap, washed down for that already-lived-in feel.',
    details: ['100% cotton twill, garment washed', 'Unstructured six-panel construction', 'Tonal embroidery and curved brim', 'Adjustable metal closure, 54-62 cm'],
  },
];

export type Artist = {
  id: string;
  name: string;
  location: string;
  discipline: string;
  image: string;
  intro: string;
  bio: string;
  releaseId: string;
};

export const artists: Artist[] = [
  {
    id: 'sora',
    name: 'SORA',
    location: 'SEOUL / EVERYWHERE',
    discipline: 'Five voices. One shared feeling.',
    image: '/images/atmos-hero.jpg',
    intro: 'Not perfectly in sync. Perfectly in the pocket.',
    bio: 'Five different paths, crossing in one room. SORA brings together voices shaped by Seoul, Tokyo, London, California, and Bangkok. Their world is built on warm basslines, unhurried hooks, and the kind of chemistry you cannot choreograph. The music comes first. Everything else finds its own rhythm.',
    releaseId: 'after-hours',
  },
  {
    id: 'june',
    name: 'JUNE',
    location: 'SEOUL / LONDON',
    discipline: 'Singer, songwriter, room-maker.',
    image: '/images/artist-june.jpg',
    intro: 'A soft voice. A lasting impression.',
    bio: 'Between the hush of a Seoul home studio and the pulse of South London, JUNE makes songs that feel like a conversation after everyone else has left. Soul, garage, and half-remembered melodies find a home in his warm, imperfect productions. Best heard with the windows down.',
    releaseId: 'soft-focus',
  },
  {
    id: 'noa',
    name: 'NOA',
    location: 'BANGKOK / LOS ANGELES',
    discipline: 'A voice between worlds.',
    image: '/images/artist-noa.jpg',
    intro: 'Somewhere between a daydream and a dancefloor.',
    bio: 'NOA moves between languages as naturally as she moves between scenes. Raised in Bangkok and shaped by long California summers, her sound lives at the intersection of unhurried R&B and sun-soaked club music. Nothing translated. Nothing put on. Just a world that was always hers.',
    releaseId: 'in-between',
  },
];

export type Release = {
  id: string;
  title: string;
  artist: string;
  type: 'EP' | 'Single';
  date: string;
  image: string;
  style: string;
  bpm: number;
  root: number;
};

export const releases: Release[] = [
  { id: 'after-hours', title: 'After Hours', artist: 'SORA', type: 'EP', date: '17 JUN 2026', image: '/images/after-hours.jpg', style: 'after-hours', bpm: 108, root: 130.81 },
  { id: 'soft-focus', title: 'Soft Focus', artist: 'JUNE', type: 'Single', date: '05 JUN 2026', image: '/images/soft-focus.jpg', style: 'soft-focus', bpm: 88, root: 146.83 },
  { id: 'in-between', title: 'In Between', artist: 'NOA', type: 'Single', date: '22 MAY 2026', image: '/images/in-between.jpg', style: 'in-between', bpm: 116, root: 164.81 },
  { id: 'blue-room', title: 'Blue Room', artist: 'JUNE', type: 'EP', date: '10 APR 2026', image: '/images/after-hours.jpg', style: 'blue-room', bpm: 92, root: 123.47 },
  { id: 'sunday', title: 'Sunday, Somewhere', artist: 'NOA', type: 'Single', date: '20 MAR 2026', image: '/images/in-between.jpg', style: 'sunday', bpm: 102, root: 174.61 },
  { id: 'first-light', title: 'First Light', artist: 'SORA', type: 'Single', date: '13 FEB 2026', image: '/images/atmos-hero.jpg', style: 'first-light', bpm: 110, root: 138.59 },
];

export type Article = {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  imageAlt: string;
  intro: string;
  paragraphs: string[];
};

export type EditorialStory = Article;

export const articles: Article[] = [
  {
    id: 'in-the-room',
    title: 'In the room. Before the world hears it.',
    category: 'STUDIO NOTES',
    date: '12.06.26',
    image: 'https://images.pexels.com/photos/5650546/pexels-photo-5650546.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    imageAlt: 'An analog mixing desk in a recording studio',
    intro: 'Some records begin with a brief. Ours tend to begin with someone saying, "Play that again."',
    paragraphs: [
      'The lights are low. Someone has left a half-finished coffee on the desk. A two-step loop has been going for twenty minutes, and nobody has asked to change it. This is usually a good sign.',
      'For the first SORA sessions, we left the cameras outside. No content to capture, no choreography to build around. Just five voices, a producer, and enough time to find the pocket. The best takes were not always the cleanest ones. They were the ones that made everyone in the room look up.',
      'That is our version of quality control. A melody that stays with you on the walk home. A bassline you feel before you really hear it. Music that does not need anything else attached to it.',
      'After Hours is the first small window into that room. We hope you find a little space of your own inside it.',
    ],
  },
  {
    id: 'everyday-uniform',
    title: 'A uniform for no particular occasion.',
    category: 'ATMOS OBJECTS',
    date: '08.06.26',
    image: '/images/atmos-campaign.jpg',
    imageAlt: 'The ATMOS everyday uniform worn on a concrete stairway',
    intro: 'Good clothes should not need a backstory. Introducing Collection 001.',
    paragraphs: [
      'We started with a simple question: would you still want it if you had never heard the music? If the answer was anything other than yes, we went back to the sample.',
      'Collection 001 is not a costume for an era. It is a small, considered beginning to a wardrobe. Heavy cotton. Room where you want it. Colors that settle in rather than stand out. A tee and a cap, made to find their way into your life.',
      'The shape of the Everyday Tee took six samples to get right. A little shorter in the body, a little wider in the sleeve, enough weight to hold its own. The Studio Cap was washed until it felt like something you had already taken everywhere.',
      'There will be more. Slowly, and only when there is something worth adding. This is a wardrobe, not a countdown.',
    ],
  },
  {
    id: 'bangkok-after-dark',
    title: 'Bangkok, from the inside out.',
    category: 'CITY FREQUENCIES',
    date: '02.06.26',
    image: 'https://images.pexels.com/photos/36527920/pexels-photo-36527920.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    imageAlt: 'A lively Bangkok Chinatown street at night',
    intro: 'A city is not a mood board. NOA takes us through the places that shaped her ear.',
    paragraphs: [
      'There is a version of Bangkok you can find in an image search. And then there is the Bangkok NOA knows: the record shop above a noodle stall, the room where the bass comes through the floor, the friends who always know where to go next.',
      '"People ask what Bangkok sounds like," she says. "I think it sounds like a lot of things happening at once, and somehow all of them belonging." That sense of easy coexistence runs through her music. Thai melodies sit beside California low-end. A half-whispered line opens into a groove.',
      'For ATMOS, being global does not mean arriving somewhere with a ready-made world. It means listening to the world that is already there. Working with the people who make it. Letting the place leave a mark on you.',
      'This is the first in City Frequencies, an ongoing series about the scenes we belong to. Not a guide from the outside. A conversation from within.',
    ],
  },
  {
    id: 'meet-noa',
    title: 'NOA is exactly where she needs to be.',
    category: 'IN CONVERSATION',
    date: '24.05.26',
    image: '/images/artist-noa.jpg',
    imageAlt: 'NOA in a quiet Bangkok parking structure',
    intro: 'On switching languages, finding your own pace, and making a home in the in-between.',
    paragraphs: [
      'NOA does not remember deciding to make music. She remembers always making it: melodies into an old phone, harmonies with her sister, little loops on a borrowed laptop.',
      'In Between holds onto that instinct. The songs are small worlds, built around a feeling rather than a formula. Some started in Bangkok. Some took shape in Los Angeles. Most happened somewhere along the way.',
      '"I used to think I had to choose which part of me to bring into a room," she says. "Now I just bring all of it." That is the feeling we heard in her first demo. And it is the feeling we want to make room for.',
    ],
  },
  {
    id: 'sora-first-light',
    title: 'Five voices. Nothing to prove.',
    category: 'ARTIST DIARY',
    date: '16.05.26',
    image: '/images/atmos-hero.jpg',
    imageAlt: 'The five members of SORA on a Seoul rooftop',
    intro: 'A rooftop, a speaker, and a first introduction to SORA.',
    paragraphs: [
      'We did not ask them to stand in a formation. We brought a speaker to a rooftop, put a record on, and let the afternoon happen. The photographs came later.',
      'SORA is a shared space for five individual voices. Some days that means a long conversation about a lyric. Other days, it means trusting the first take. The common thread is not where they come from. It is how they listen to one another.',
      'First Light was the beginning. After Hours is the next chapter. There is no grand reveal waiting around the corner. Just more music, more room, and more reasons to stay a little longer.',
    ],
  },
];

export const stories = articles;

export const navLinks = [
  { label: 'Apparel', href: '#apparel' },
  { label: 'Artists', href: '#artists' },
  { label: 'Releases', href: '#releases' },
  { label: 'Journal', href: '#journal' },
  { label: 'About', href: '#about' },
];

export const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

export function readLocal<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
