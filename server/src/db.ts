/**
 * Mock database — replaces spaceModel.ts.
 * Types mirror the Prisma schema exactly.
 * Space/User carry a few UI-only extras (venueType, imageUrl, tags, pronouns,
 * avatar) that will need to be added to schema.prisma before switching to a
 * real database.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type VenueType =
  | "cafe" | "restaurant" | "bar" | "nightclub"
  | "gym" | "studio" | "pool"
  | "library" | "bookstore" | "theatre" | "cinema" | "gallery"
  | "park" | "salon" | "clinic" | "coworking" | "hostel" | "record-store";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  pronouns?: string;   // UI extension — add to schema
  avatar?: string;     // UI extension — add to schema
  createdAt: Date;
  updatedAt: Date;
}

export interface Space {
  id: string;
  name: string;
  description: string | null;
  location: string;
  price: number;
  userId: string;
  venueType: VenueType; // UI extension — add to schema
  imageUrl?: string;    // UI extension — use Media relation in real DB
  tags: string[];       // UI extension — use Tag relations in real DB
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  content: string;
  rating: number;
  userId: string | null;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: string;
  value: number;
  userId: string;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Media {
  id: string;
  url: string;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: string;
  reason: string;
  userId: string;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessibilityInfo {
  id: string;
  name: string;
  userId: string | null;
  spaceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const D = new Date("2024-01-01T00:00:00Z");
const img = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&h=600&q=80`;

// ─── Users ────────────────────────────────────────────────────────────────────

export const users: User[] = [
  { id: "user-linnea",  email: "linnea@example.com",  name: "Linnea",  password: "hashed", pronouns: "she/her",   avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Linnea&skinColor=DarkBrown&mouth=Default",     createdAt: D, updatedAt: D },
  { id: "user-erik",    email: "erik@example.com",    name: "Erik",    password: "hashed", pronouns: "he/him",    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Erik&skinColor=Black&mouth=Serious",           createdAt: D, updatedAt: D },
  { id: "user-mira",    email: "mira@example.com",    name: "Mira",    password: "hashed", pronouns: "she/her",   avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mira&skinColor=Brown&mouth=Smile",             createdAt: D, updatedAt: D },
  { id: "user-tobias",  email: "tobias@example.com",  name: "Tobias",  password: "hashed", pronouns: "he/him",    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=Tobias",                                          createdAt: D, updatedAt: D },
  { id: "user-jamal",   email: "jamal@example.com",   name: "Jamal",   password: "hashed", pronouns: "he/him",    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jamal&skinColor=DarkBrown&mouth=Default",      createdAt: D, updatedAt: D },
  { id: "user-sofia",   email: "sofia@example.com",   name: "Sofia",   password: "hashed", pronouns: "she/her",   avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sofia&skinColor=Black&mouth=Twinkle",          createdAt: D, updatedAt: D },
  { id: "user-oskar",   email: "oskar@example.com",   name: "Oskar",   password: "hashed", pronouns: "he/him",    avatar: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Oskar",                                        createdAt: D, updatedAt: D },
  { id: "user-anna",    email: "anna@example.com",    name: "Anna",    password: "hashed", pronouns: "she/her",   avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Anna&skinColor=Brown&mouth=Smile",             createdAt: D, updatedAt: D },
  { id: "user-felix",   email: "felix@example.com",   name: "Felix",   password: "hashed", pronouns: "he/him",    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&skinColor=DarkBrown&mouth=Serious",      createdAt: D, updatedAt: D },
  { id: "user-robin",   email: "robin@example.com",   name: "Robin",   password: "hashed", pronouns: "they/them", avatar: "https://api.dicebear.com/9.x/shapes/svg?seed=Robin",                                           createdAt: D, updatedAt: D },
  { id: "user-charlie", email: "charlie@example.com", name: "Charlie", password: "hashed", pronouns: "they/them", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=Charlie",                                         createdAt: D, updatedAt: D },
  { id: "user-marta",   email: "marta@example.com",   name: "Marta",   password: "hashed", pronouns: "she/her",   avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marta&skinColor=Black&mouth=Default",          createdAt: D, updatedAt: D },
  { id: "user-theo",    email: "theo@example.com",    name: "Theo",    password: "hashed", pronouns: "he/him",    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Theo&skinColor=Brown&mouth=Concerned",         createdAt: D, updatedAt: D },
  { id: "user-lena",    email: "lena@example.com",    name: "Lena",    password: "hashed", pronouns: "she/her",   avatar: "https://api.dicebear.com/9.x/croodles/svg?seed=Lena",                                          createdAt: D, updatedAt: D },
  { id: "user-nadia",   email: "nadia@example.com",   name: "Nadia",   password: "hashed", pronouns: "she/her",   avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Nadia&skinColor=DarkBrown&mouth=Smile",        createdAt: D, updatedAt: D },
  { id: "user-hassan",  email: "hassan@example.com",  name: "Hassan",  password: "hashed", pronouns: "he/him",    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Hassan&skinColor=Black&mouth=Default",         createdAt: D, updatedAt: D },
  { id: "user-kim",     email: "kim@example.com",     name: "Kim",     password: "hashed", pronouns: "they/them", avatar: "https://api.dicebear.com/9.x/shapes/svg?seed=Kim",                                             createdAt: D, updatedAt: D },
  { id: "user-diego",   email: "diego@example.com",   name: "Diego",   password: "hashed", pronouns: "he/him",    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Diego&skinColor=Brown&mouth=Tongue",           createdAt: D, updatedAt: D },
  { id: "user-maja",    email: "maja@example.com",    name: "Maja",    password: "hashed", pronouns: "she/her",   avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Maja&skinColor=Light&mouth=Default",           createdAt: D, updatedAt: D },
  { id: "user-priya",   email: "priya@example.com",   name: "Priya",   password: "hashed", pronouns: "she/her",   avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya&skinColor=Brown&mouth=Default",          createdAt: D, updatedAt: D },
  { id: "user-yusuf",   email: "yusuf@example.com",   name: "Yusuf",   password: "hashed", pronouns: "he/him",    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=Yusuf",                                           createdAt: D, updatedAt: D },
  { id: "user-lukas",   email: "lukas@example.com",   name: "Lukas",   password: "hashed", pronouns: "he/him",    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lukas&skinColor=Tanned&mouth=Serious",         createdAt: D, updatedAt: D },
  { id: "user-sam",     email: "sam@example.com",     name: "Sam",     password: "hashed", pronouns: "they/them", avatar: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Sam",                                          createdAt: D, updatedAt: D },
  { id: "user-owner",   email: "owner@safespace.app", name: "Safe Space Admin", password: "hashed",                                                                                                                         createdAt: D, updatedAt: D },
];

// ─── Tags ─────────────────────────────────────────────────────────────────────

const TAG_NAMES = [
  "wheelchair-accessible", "step-free", "accessible-bathroom", "pool-hoist",
  "automatic-doors", "large-print", "captions", "adaptive-routes",
  "sensory-friendly", "low-noise", "quiet-space",
  "lgbtq-owned", "lgbtq-affirming", "trans-friendly", "trans-affirming",
  "sapphic-owned", "bipoc-owned", "bipoc-affirming", "women-owned",
  "sliding-scale", "free-entry", "alcohol-free", "sober-friendly",
  "body-positive",
  "chest-feeding-friendly", "changing-table-all-genders", "family-bathroom",
  "stroller-accessible", "high-chairs", "kids-welcome",
];

export const tags: Tag[] = TAG_NAMES.map((name, i) => ({
  id: `tag-${i + 1}`,
  name,
  createdAt: D,
  updatedAt: D,
}));

// ─── Categories (venue types) ─────────────────────────────────────────────────

const VENUE_TYPES: VenueType[] = [
  "cafe", "restaurant", "bar", "nightclub", "gym", "studio", "pool",
  "library", "bookstore", "theatre", "cinema", "gallery", "park",
  "salon", "clinic", "coworking", "hostel", "record-store",
];

export const categories: Category[] = VENUE_TYPES.map((name, i) => ({
  id: `cat-${i + 1}`,
  name,
  createdAt: D,
  updatedAt: D,
}));

// ─── Locations ────────────────────────────────────────────────────────────────

export const locations: Location[] = [
  { id: "loc-1", name: "Stockholm", createdAt: D, updatedAt: D },
  { id: "loc-2", name: "Malmö",     createdAt: D, updatedAt: D },
  { id: "loc-3", name: "Göteborg",  createdAt: D, updatedAt: D },
  { id: "loc-4", name: "Lund",      createdAt: D, updatedAt: D },
  { id: "loc-5", name: "Uppsala",   createdAt: D, updatedAt: D },
];

// ─── Spaces ───────────────────────────────────────────────────────────────────

export const spaces: Space[] = [
  {
    id: "place-1", name: "Central Cafe", location: "Malmö", price: 45,
    userId: "user-owner",
    description: "Cozy coffee place in the old town with a steady afternoon crowd.",
    imageUrl: img("1554118811-1e0d58224f24"), venueType: "cafe",
    tags: ["wheelchair-accessible", "step-free", "accessible-bathroom", "changing-table-all-genders", "high-chairs", "kids-welcome"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-2", name: "Fitness Hub", location: "Lund", price: 550,
    userId: "user-owner",
    description: "Modern training center with a big free-weights area.",
    imageUrl: img("1534438327276-14e5300c3a48"), venueType: "gym",
    tags: [],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-3", name: "Stonewall Strength", location: "Stockholm", price: 650,
    userId: "user-robin",
    description: "LGBTQIA+-owned strength gym in Södermalm. Coached lifts, no judgement, pronouns on staff lanyards, sliding-scale memberships.",
    imageUrl: img("1571902943202-507ec2618e8f"), venueType: "gym",
    tags: ["lgbtq-owned", "trans-friendly", "sliding-scale"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-4", name: "Saga Coffee House", location: "Göteborg", price: 45,
    userId: "user-maja",
    description: "Small sapphic-owned cafe near Linnéplatsen. Plants everywhere, vinyl on weekends.",
    imageUrl: img("1453614512568-c4024d13c247"), venueType: "cafe",
    tags: ["sapphic-owned", "lgbtq-affirming", "chest-feeding-friendly", "changing-table-all-genders", "high-chairs", "kids-welcome"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-5", name: "Boulder Bee Studio", location: "Malmö", price: 420,
    userId: "user-mira",
    description: "Bouldering gym with a strong LGBTQIA+ and disability-inclusive climbing community. Adaptive routes set monthly; weekly beginner sessions.",
    imageUrl: img("1547036967-23d11aacaee0"), venueType: "gym",
    tags: ["lgbtq-affirming", "wheelchair-accessible", "adaptive-routes"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-6", name: "Tango House", location: "Stockholm", price: 180,
    userId: "user-kim",
    description: "Dance studio teaching Argentine tango with traditional and same-sex milongas. No fixed lead/follow roles. Wheelchair-accessible floor.",
    imageUrl: img("1547153760-18fc86324498"), venueType: "studio",
    tags: ["lgbtq-affirming", "wheelchair-accessible"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-7", name: "Sportbar Tre Kronor", location: "Göteborg", price: 89,
    userId: "user-owner",
    description: "Classic sports bar near the stadium. Beer on tap, every match on the screens.",
    imageUrl: img("1546726747-421c6d69c929"), venueType: "bar",
    tags: [],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-8", name: "Northern CrossFit", location: "Lund", price: 600,
    userId: "user-owner",
    description: "CrossFit box with morning and evening classes. Welcomes all levels but expect a real workout.",
    imageUrl: img("1583454110551-21f2fa2afe61"), venueType: "gym",
    tags: [],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-9", name: "Stonewall Library", location: "Stockholm", price: 0,
    userId: "user-owner",
    description: "Public library with one of the largest LGBTQIA+ collections in the Nordics. Pronoun pins at the front desk, step-free entrance, large-print and audiobook options.",
    imageUrl: img("1481627834876-b7833e8f5570"), venueType: "library",
    tags: ["lgbtq-affirming", "step-free", "automatic-doors", "large-print", "free-entry", "family-bathroom", "stroller-accessible", "kids-welcome", "changing-table-all-genders"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-10", name: "The Common Stage", location: "Stockholm", price: 220,
    userId: "user-owner",
    description: "Community theatre in a converted warehouse. Cheap tickets, BYO snacks, productions that take risks. Captioned performances on Sundays.",
    imageUrl: img("1503095396549-807759245b35"), venueType: "theatre",
    tags: ["captions", "lgbtq-affirming"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-11", name: "The Mira Hub", location: "Stockholm", price: 450,
    userId: "user-mira",
    description: "Co-working space in Vasastan with quiet desks, phone-booth rooms, pronouns on staff name badges, and a sensory-friendly hour every weekday morning.",
    imageUrl: img("1497366754035-f200968a6e72"), venueType: "coworking",
    tags: ["sensory-friendly", "wheelchair-accessible", "lgbtq-affirming"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-12", name: "Folkbadet", location: "Malmö", price: 120,
    userId: "user-owner",
    description: "Public swimming hall with weekly trans-friendly hours, family changing rooms with private cubicles, working pool hoist, and larger swimsuits in stock.",
    imageUrl: img("1530549387789-4c1017266635"), venueType: "pool",
    tags: ["trans-affirming", "pool-hoist", "wheelchair-accessible", "family-bathroom", "changing-table-all-genders", "stroller-accessible", "kids-welcome"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-13", name: "Vinyl Lab Records", location: "Göteborg", price: 199,
    userId: "user-tobias",
    description: "Independent record store with one of the best LGBTQIA+-music sections in Sweden. In-store shows on Tuesdays, signed releases by trans and disabled artists.",
    imageUrl: img("1483412033650-1015ddeb83d1"), venueType: "record-store",
    tags: ["lgbtq-affirming"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-14", name: "Velvet Lounge", location: "Stockholm", price: 135,
    userId: "user-nadia",
    description: "Cocktail bar in Södermalm with weekly drag nights and a famously good vermouth list.",
    imageUrl: img("1514933651103-005eec06c04b"), venueType: "bar",
    tags: ["lgbtq-affirming"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-15", name: "Iron Garden", location: "Stockholm", price: 490,
    userId: "user-owner",
    description: "24/7 industrial-style gym in Hammarby Sjöstad. Mixed crowd, techno on the speakers, no mirrors in the free-weights area.",
    imageUrl: img("1591291621164-2c6367723315"), venueType: "gym",
    tags: [],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-16", name: "Sober Sundays", location: "Malmö", price: 45,
    userId: "user-charlie",
    description: "Alcohol-free bar and cafe in Möllevången with LGBT-friendly programming and mocktail flights.",
    imageUrl: img("1559925393-8be0ec4767c8"), venueType: "cafe",
    tags: ["alcohol-free", "sober-friendly", "lgbtq-affirming"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-17", name: "Pride Lift Club", location: "Stockholm", price: 700,
    userId: "user-theo",
    description: "LGBTQIA+ powerlifting club in Hägersten. Beginner-friendly intake, coached meets, women's and trans-only hours.",
    imageUrl: img("1540497077202-7c8a3999166f"), venueType: "gym",
    tags: ["lgbtq-owned", "trans-friendly", "trans-affirming"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-18", name: "The Locker Room", location: "Göteborg", price: 480,
    userId: "user-owner",
    description: "Old-school commercial gym near Avenyn. Loud, busy, lots of CrossFit-adjacent regulars.",
    imageUrl: img("1568901346375-23c9450c58cd"), venueType: "gym",
    tags: [],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-19", name: "Estudio Verde", location: "Malmö", price: 350,
    userId: "user-priya",
    description: "Yoga studio near Möllevångstorget with an explicit body-positive, LGBTQIA+-affirming policy. Fat-friendly props and chair-yoga classes weekly.",
    imageUrl: img("1545205597-3d9d02c29597"), venueType: "studio",
    tags: ["lgbtq-affirming", "body-positive", "chest-feeding-friendly"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-20", name: "Bar Provence", location: "Stockholm", price: 155,
    userId: "user-owner",
    description: "Classic wine bar in Östermalm. Tight list of French naturals, no-frills service.",
    imageUrl: img("1510812431401-41d2bd2722f3"), venueType: "bar",
    tags: [],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-21", name: "Café Bechdel", location: "Malmö", price: 42,
    userId: "user-charlie",
    description: "Feminist and LGBT cafe in Möllevången. Books on the walls, zines on the counter, no laptops after 4pm.",
    imageUrl: img("1507842217343-583bb7270b66"), venueType: "cafe",
    tags: ["lgbtq-affirming", "women-owned", "chest-feeding-friendly", "changing-table-all-genders", "kids-welcome"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-22", name: "Marais Coffee", location: "Stockholm", price: 48,
    userId: "user-yusuf",
    description: "Tiny espresso bar in Södermalm, named after Paris's gay quarter. Locals, tourists, drag queens between gigs.",
    imageUrl: img("1517022812141-23620dba5c23"), venueType: "cafe",
    tags: ["lgbtq-affirming"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-23", name: "FlowMotion Yoga", location: "Göteborg", price: 380,
    userId: "user-sam",
    description: "Big multi-room yoga studio near Linnéplatsen. Vinyasa, yin, prenatal, and a weekly LGBT-led class.",
    imageUrl: img("1588286840104-8957b019727f"), venueType: "studio",
    tags: ["lgbtq-affirming"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-24", name: "Spike Volleyball Bar", location: "Göteborg", price: 79,
    userId: "user-owner",
    description: "Beach-volleyball-themed bar on Hisingen. Sand court out back, mostly straight crowd, lively atmosphere.",
    imageUrl: img("1592656094267-764a45160876"), venueType: "bar",
    tags: [],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-25", name: "Lavender Lifts", location: "Malmö", price: 500,
    userId: "user-charlie",
    description: "LGBTQIA+-owned strength and conditioning gym in Värnhem. Coached only, small classes, sliding-scale membership.",
    imageUrl: img("1611162616305-c69b3fa7fbe0"), venueType: "gym",
    tags: ["lgbtq-owned", "sliding-scale", "trans-friendly"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-26", name: "Solidaridad Kitchen", location: "Stockholm", price: 320,
    userId: "user-diego",
    description: "Latin American restaurant in Skanstull run by an LGBT couple. Ceviche, arepas, and a Pride flag behind the bar.",
    imageUrl: img("1565299624946-b28f40a0ae38"), venueType: "restaurant",
    tags: ["lgbtq-owned", "bipoc-owned", "high-chairs", "kids-welcome"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-27", name: "Page & Pride Bookstore", location: "Uppsala", price: 145,
    userId: "user-mira",
    description: "Independent LGBT bookstore in central Uppsala with a curated rainbow children's section and a weekly poetry night.",
    imageUrl: img("1521587760476-6c12a4b040da"), venueType: "bookstore",
    tags: ["lgbtq-owned", "lgbtq-affirming", "chest-feeding-friendly", "family-bathroom", "kids-welcome"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-28", name: "Cinéma du Coin", location: "Stockholm", price: 140,
    userId: "user-owner",
    description: "Two-screen arthouse cinema in Vasastan. Monthly LGBT film festival, captioned screenings, and a small bar in the lobby.",
    imageUrl: img("1489599849927-2ee91cede3ba"), venueType: "cinema",
    tags: ["captions", "lgbtq-affirming"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-29", name: "Pride Health", location: "Stockholm", price: 0,
    userId: "user-owner",
    description: "LGBTQIA+-affirming community health clinic in Telefonplan. GP services, free STI testing, trans-affirming care, trauma-informed staff.",
    imageUrl: img("1576091160399-112ba8d25d1d"), venueType: "clinic",
    tags: ["lgbtq-affirming", "trans-affirming", "wheelchair-accessible"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-30", name: "Studio Trim", location: "Stockholm", price: 650,
    userId: "user-theo",
    description: "Gender-neutral hair salon in Södermalm. Flat-rate pricing by service, not by gender. No assumptions made at the chair.",
    imageUrl: img("1562322140-8baeececf3df"), venueType: "salon",
    tags: ["lgbtq-affirming", "trans-affirming"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-31", name: "House of Glitter", location: "Stockholm", price: 180,
    userId: "user-nadia",
    description: "LGBTQIA+ nightclub at Slussen. Mixed-night programming, gender-neutral bathrooms, step-free entrance, door staff that genuinely watch out for you.",
    imageUrl: img("1545128485-c400e7702796"), venueType: "nightclub",
    tags: ["lgbtq-affirming", "wheelchair-accessible", "step-free"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-32", name: "Modern Art Forum", location: "Göteborg", price: 0,
    userId: "user-sam",
    description: "Small contemporary art gallery focused on LGBT and diaspora artists. Free entry on first Thursdays. Sensory-friendly viewing hours twice a month.",
    imageUrl: img("1531058020387-3be344556be6"), venueType: "gallery",
    tags: ["lgbtq-affirming", "bipoc-affirming", "sensory-friendly", "free-entry", "stroller-accessible", "kids-welcome"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-33", name: "Sankt Hans Park", location: "Lund", price: 0,
    userId: "user-owner",
    description: "Large urban park that hosts LGBT skate meets, summer drag picnics, and a weekly community market.",
    imageUrl: img("1500382017468-9049fed747ef"), venueType: "park",
    tags: ["lgbtq-affirming", "free-entry", "stroller-accessible", "kids-welcome", "family-bathroom"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-34", name: "La Cantine", location: "Göteborg", price: 380,
    userId: "user-diego",
    description: "LGBT-owned bistro near Linnéplatsen. Lyonnaise classics, a thoughtful vegan option, two-hour dinners welcome.",
    imageUrl: img("1517248135467-4c7edcad34c4"), venueType: "restaurant",
    tags: ["lgbtq-owned", "high-chairs", "kids-welcome", "family-bathroom"],
    createdAt: D, updatedAt: D,
  },
  {
    id: "place-35", name: "Rainbow Hostel", location: "Stockholm", price: 290,
    userId: "user-yusuf",
    description: "LGBTQ+ hostel near Centralen. Gender-inclusive dorm option, weekly LGBT mixers in the common room.",
    imageUrl: img("1568495248636-6432b97bd949"), venueType: "hostel",
    tags: ["lgbtq-owned", "lgbtq-affirming"],
    createdAt: D, updatedAt: D,
  },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviews: Review[] = [
  // place-1: Central Cafe
  { id: "rev-1-1",  spaceId: "place-1",  userId: "user-linnea",  rating: 4, content: "Step-free entrance round the side, accessible bathroom, and staff who always greet me and my girlfriend warmly. Small things, all of them.", createdAt: D, updatedAt: D },
  { id: "rev-1-2",  spaceId: "place-1",  userId: "user-erik",    rating: 3, content: "Crowd skews quite hetero after work. Not unsafe, just not my scene.", createdAt: D, updatedAt: D },
  { id: "rev-1-3",  spaceId: "place-1",  userId: "user-mira",    rating: 5, content: "Worked here for hours and nobody so much as glanced at the pronoun pin on my laptop.", createdAt: D, updatedAt: D },
  { id: "rev-1-4",  spaceId: "place-1",  userId: "user-tobias",  rating: 2, content: "Came with my partner. Server seemed visibly thrown when we held hands. Didn't refuse service, just made the meal awkward. Won't be back.", createdAt: D, updatedAt: D },
  // place-2: Fitness Hub
  { id: "rev-2-1",  spaceId: "place-2",  userId: "user-jamal",   rating: 4, content: "Equipment is fine. Locker rooms are strictly gendered though, so as a non-binary Black lifter I change in a bathroom stall and try to make myself invisible. The math gets old.", createdAt: D, updatedAt: D },
  { id: "rev-2-2",  spaceId: "place-2",  userId: "user-sofia",   rating: 3, content: "Front desk gendered me correctly without me having to correct anyone. Small win for an otherwise generic gym.", createdAt: D, updatedAt: D },
  { id: "rev-2-3",  spaceId: "place-2",  userId: "user-oskar",   rating: 5, content: "Early mornings are quiet, the music is at a sane volume, and equipment is well-spaced if you use a wheelchair. The 6pm crowd is a different story.", createdAt: D, updatedAt: D },
  { id: "rev-2-4",  spaceId: "place-2",  userId: "user-anna",    rating: 2, content: "Got 'ladies, ladies' from a trainer twice during onboarding even after I asked him to stop. Won't be back.", createdAt: D, updatedAt: D },
  { id: "rev-2-5",  spaceId: "place-2",  userId: "user-felix",   rating: 1, content: "Trainer 'forgot' my chosen name three times in one session and laughed when I corrected him. The 'forgetting' is the cruelty. Cancelled the membership the next day.", createdAt: D, updatedAt: D },
  // place-3: Stonewall Strength
  { id: "rev-3-1",  spaceId: "place-3",  userId: "user-robin",   rating: 5, content: "First gym where I actually felt safe training in my binder. Coaches are excellent.", createdAt: D, updatedAt: D },
  { id: "rev-3-2",  spaceId: "place-3",  userId: "user-charlie", rating: 5, content: "The trans-friendly changing room policy is the real deal, not just a sticker on the door.", createdAt: D, updatedAt: D },
  { id: "rev-3-3",  spaceId: "place-3",  userId: "user-marta",   rating: 4, content: "Pricey, but the women's lifting collective on Saturdays is the only one I've found where I'm not the only Black lifter in the room. Worth every krona.", createdAt: D, updatedAt: D },
  { id: "rev-3-4",  spaceId: "place-3",  userId: "user-theo",    rating: 5, content: "First time I've been coached by another trans guy. Made the difference between dreading deadlifts and loving them.", createdAt: D, updatedAt: D },
  { id: "rev-3-5",  spaceId: "place-3",  userId: "user-lena",    rating: 2, content: "Loved the vibe but the front desk made a real mess of my membership. Three months of being charged the wrong rate, three months of nobody returning calls. Sloppy admin for a gym this expensive.", createdAt: D, updatedAt: D },
  // place-4: Saga Coffee House
  { id: "rev-4-1",  spaceId: "place-4",  userId: "user-maja",    rating: 5, content: "Felt at home from the second I walked in. They also host a sapphic book club on Sundays.", createdAt: D, updatedAt: D },
  { id: "rev-4-2",  spaceId: "place-4",  userId: "user-priya",   rating: 4, content: "Owner asked about my pronouns the second time I came in. Felt seen, not interrogated. Cardamom bun is also unreal.", createdAt: D, updatedAt: D },
  { id: "rev-4-3",  spaceId: "place-4",  userId: "user-yusuf",   rating: 5, content: "Community board has everything from dyke marches to top-surgery fundraisers, and a corner specifically for Muslim LGBT support groups. The cafe is more than a cafe.", createdAt: D, updatedAt: D },
  { id: "rev-4-4",  spaceId: "place-4",  userId: "user-lukas",   rating: 2, content: "Coffee is good but a regular cornered me to lecture me about being a 'good ally' for fifteen minutes. The owner watched and didn't intervene. Won't be back.", createdAt: D, updatedAt: D },
  // place-5: Boulder Bee Studio
  { id: "rev-5-1",  spaceId: "place-5",  userId: "user-mira",    rating: 5, content: "Pride climb night on Wednesdays is the highlight of my week. The community here is unmatched.", createdAt: D, updatedAt: D },
  { id: "rev-5-2",  spaceId: "place-5",  userId: "user-erik",    rating: 3, content: "Routes get reset way less often than they should and the chalk situation is grim. Community is great, facility is mid.", createdAt: D, updatedAt: D },
  { id: "rev-5-3",  spaceId: "place-5",  userId: "user-linnea",  rating: 5, content: "Showed up alone after top surgery looking for a low-impact return to movement. Staff helped me find easy routes without making it weird.", createdAt: D, updatedAt: D },
  { id: "rev-5-4",  spaceId: "place-5",  userId: "user-hassan",  rating: 4, content: "Wall isn't huge but the trans climbers' chat group means I always have a belay partner. The adaptive routes the setters added last month were a revelation.", createdAt: D, updatedAt: D },
  // place-6: Tango House
  { id: "rev-6-1",  spaceId: "place-6",  userId: "user-robin",   rating: 5, content: "Same-sex milonga on Fridays is the only place I've found where I can dance both roles without explaining myself.", createdAt: D, updatedAt: D },
  { id: "rev-6-2",  spaceId: "place-6",  userId: "user-marta",   rating: 4, content: "Teachers are technical but never strict about gendered roles, and they coach poses that work for the body in front of them. Refreshing.", createdAt: D, updatedAt: D },
  { id: "rev-6-3",  spaceId: "place-6",  userId: "user-kim",     rating: 5, content: "First time leading another woman in tango and feeling like nobody in the room thought it was strange. Cried a little.", createdAt: D, updatedAt: D },
  { id: "rev-6-4",  spaceId: "place-6",  userId: "user-theo",    rating: 2, content: "Love the inclusive concept but the venue is genuinely dirty. Bathrooms looked like they hadn't been cleaned in weeks. Tango is great, basic hygiene is not.", createdAt: D, updatedAt: D },
  // place-7: Sportbar Tre Kronor
  { id: "rev-7-1",  spaceId: "place-7",  userId: "user-erik",    rating: 1, content: "Got refused service after a bartender clocked me holding hands with my partner. Manager apologised the next day but the damage was done. Stay away.", createdAt: D, updatedAt: D },
  { id: "rev-7-2",  spaceId: "place-7",  userId: "user-oskar",   rating: 3, content: "Crowd is overwhelmingly straight dudes. Food is fine, vibes are not for everyone.", createdAt: D, updatedAt: D },
  { id: "rev-7-3",  spaceId: "place-7",  userId: "user-jamal",   rating: 4, content: "Staff is friendly and didn't misgender me when I corrected them. That's all I ask of a sports bar.", createdAt: D, updatedAt: D },
  { id: "rev-7-4",  spaceId: "place-7",  userId: "user-felix",   rating: 2, content: "Got called a slur by a drunk regular after the derby. Staff did intervene, but I'm not going back.", createdAt: D, updatedAt: D },
  // place-8: Northern CrossFit
  { id: "rev-8-1",  spaceId: "place-8",  userId: "user-sofia",   rating: 4, content: "Coaches say 'athletes' instead of 'ladies', which sounds small until you've been the only AFAB person in the box and it lands hard.", createdAt: D, updatedAt: D },
  { id: "rev-8-2",  spaceId: "place-8",  userId: "user-anna",    rating: 3, content: "Community is solid but the music level at 6pm makes my migraines worse. Morning class is much chiller, headphones not required.", createdAt: D, updatedAt: D },
  { id: "rev-8-3",  spaceId: "place-8",  userId: "user-diego",   rating: 5, content: "Coaches took my chest binder seriously when they programmed scaling for me. First box that's done that without me asking three times. Also: I'm the only Latine person here and they didn't make it weird.", createdAt: D, updatedAt: D },
  { id: "rev-8-4",  spaceId: "place-8",  userId: "user-lukas",   rating: 1, content: "Coaches preach inclusion on Instagram and call women 'sweetheart' in class. Either the bio is wrong or the coaches don't read it. Quit after two months. Refund request ignored.", createdAt: D, updatedAt: D },
  // place-9: Stonewall Library
  { id: "rev-9-1",  spaceId: "place-9",  userId: "user-robin",   rating: 5, content: "First public library I've been in where the LGBTQ+ shelf isn't tucked away. It's front and centre.", createdAt: D, updatedAt: D },
  { id: "rev-9-2",  spaceId: "place-9",  userId: "user-charlie", rating: 5, content: "Quiet, well-lit, automatic doors at the entrance, librarians wear pronoun pins. Best afternoon refuge in the city for a wheelchair user who needs predictable spaces.", createdAt: D, updatedAt: D },
  { id: "rev-9-3",  spaceId: "place-9",  userId: "user-marta",   rating: 4, content: "Excellent lesbian history section, and the Black queer reading list curated for last year's Pride is still on display. Wifi is patchy near the windows.", createdAt: D, updatedAt: D },
  { id: "rev-9-4",  spaceId: "place-9",  userId: "user-theo",    rating: 5, content: "Used the gender-neutral bathroom three times in one visit because I could. Small joy.", createdAt: D, updatedAt: D },
  { id: "rev-9-5",  spaceId: "place-9",  userId: "user-lena",    rating: 2, content: "Collection is great in theory, but half the books I tried to borrow were 'lost in transit' or never returned. Catalogue listings are from 2019. The intention is there; the funding clearly isn't.", createdAt: D, updatedAt: D },
  // place-10: The Common Stage
  { id: "rev-10-1", spaceId: "place-10", userId: "user-maja",    rating: 5, content: "Saw a sapphic reimagining of A Midsummer Night's Dream here. Staff gave me a free programme when they saw I came alone.", createdAt: D, updatedAt: D },
  { id: "rev-10-2", spaceId: "place-10", userId: "user-lukas",   rating: 4, content: "Tiny venue with big heart. Productions uneven, energy unmatched. The post-show Q&A was the most thoughtful conversation I've had all year.", createdAt: D, updatedAt: D },
  { id: "rev-10-3", spaceId: "place-10", userId: "user-marta",   rating: 5, content: "Trans actor played the lead. No big announcement, just casting. That's how it should be.", createdAt: D, updatedAt: D },
  { id: "rev-10-4", spaceId: "place-10", userId: "user-priya",   rating: 2, content: "Saw a piece about LGBT migration written by someone who'd clearly never met one. Earnest, condescending, and two and a half hours long. Left at intermission.", createdAt: D, updatedAt: D },
  // place-11: The Mira Hub
  { id: "rev-11-1", spaceId: "place-11", userId: "user-robin",   rating: 4, content: "Quiet desks, hot-desk pricing, pronouns on staff name badges. As a freelancer mid-transition, that matters.", createdAt: D, updatedAt: D },
  { id: "rev-11-2", spaceId: "place-11", userId: "user-sam",     rating: 5, content: "Best phone-booth rooms in the city. As an autistic adult with ADHD I get my best work done here.", createdAt: D, updatedAt: D },
  { id: "rev-11-3", spaceId: "place-11", userId: "user-sofia",   rating: 4, content: "Coffee is decent, snacks are free, all-gender bathroom is the cleanest in any office I've been in, and the lift is reliable.", createdAt: D, updatedAt: D },
  { id: "rev-11-4", spaceId: "place-11", userId: "user-lukas",   rating: 1, content: "Paid for an annual membership up-front and they changed the pricing structure two months in, no refund offered. Customer service is a chatbot that loops. Avoid the annual plan at all costs.", createdAt: D, updatedAt: D },
  // place-12: Folkbadet
  { id: "rev-12-1", spaceId: "place-12", userId: "user-theo",    rating: 5, content: "Trans-friendly swim hours on Thursdays changed my relationship with my body. Hadn't been in a pool in eight years before this.", createdAt: D, updatedAt: D },
  { id: "rev-12-2", spaceId: "place-12", userId: "user-felix",   rating: 5, content: "Family changing rooms with private cubicles for everyone. As a trans guy I finally got to swim without dread.", createdAt: D, updatedAt: D },
  { id: "rev-12-3", spaceId: "place-12", userId: "user-linnea",  rating: 4, content: "Public pool doing the basic thing — making everyone safe — better than any private gym I've been to. Pool hoist works, and nobody side-eyed my fat body in the changing room.", createdAt: D, updatedAt: D },
  { id: "rev-12-4", spaceId: "place-12", userId: "user-mira",    rating: 2, content: "Inclusive hours are excellent on paper, but one regular lifeguard misgendered me three sessions in a row. Reported it twice, nothing changed. Switched to a different pool.", createdAt: D, updatedAt: D },
  // place-13: Vinyl Lab Records
  { id: "rev-13-1", spaceId: "place-13", userId: "user-tobias",  rating: 5, content: "Best curated LGBTQIA+ section in Sweden. The owner knows every release by heart and stocks pressings from disabled artists you won't find elsewhere.", createdAt: D, updatedAt: D },
  { id: "rev-13-2", spaceId: "place-13", userId: "user-maja",    rating: 4, content: "Sat on the floor flipping records for two hours. Owner brought me coffee. Found a Tracy Chapman pressing I'd been hunting for.", createdAt: D, updatedAt: D },
  { id: "rev-13-3", spaceId: "place-13", userId: "user-erik",    rating: 3, content: "Owner is lovely but the pricing is steep — twice the going rate on a few pressings I checked. The 'LGBT section' is also half-mainstream pop. Mixed feelings.", createdAt: D, updatedAt: D },
  { id: "rev-13-4", spaceId: "place-13", userId: "user-charlie", rating: 5, content: "Hosts in-store performances. Saw a sapphic punk band on a Tuesday and felt like I was eighteen again.", createdAt: D, updatedAt: D },
  // place-14: Velvet Lounge
  { id: "rev-14-1", spaceId: "place-14", userId: "user-nadia",   rating: 5, content: "Saturday drag brunch is iconic. Hugged the host on the way out. They sell out two weeks in advance, book ahead.", createdAt: D, updatedAt: D },
  { id: "rev-14-2", spaceId: "place-14", userId: "user-hassan",  rating: 4, content: "Bartenders are kind to everyone and the drag queens get a free shot from the kitchen between sets. That detail says it all.", createdAt: D, updatedAt: D },
  { id: "rev-14-3", spaceId: "place-14", userId: "user-kim",     rating: 5, content: "One of the few places in town where I never have to explain who I am.", createdAt: D, updatedAt: D },
  { id: "rev-14-4", spaceId: "place-14", userId: "user-diego",   rating: 3, content: "Drinks are great but the regulars are tight-knit. Took me three visits before anyone made eye contact. Worth it once they did.", createdAt: D, updatedAt: D },
  // place-15: Iron Garden
  { id: "rev-15-1", spaceId: "place-15", userId: "user-sam",     rating: 4, content: "Open 24/7 means I can train when the place is half-empty. As an AFAB lifter tired of catcalls and unsolicited form tips, this is everything.", createdAt: D, updatedAt: D },
  { id: "rev-15-2", spaceId: "place-15", userId: "user-lena",    rating: 3, content: "Mixed crowd, but it leans hetero-bro after 7pm. Earlier in the day it's lovely and quiet.", createdAt: D, updatedAt: D },
  { id: "rev-15-3", spaceId: "place-15", userId: "user-felix",   rating: 5, content: "Nobody bothered me once they saw the testosterone shot in my locker. Big-city anonymity in the best way.", createdAt: D, updatedAt: D },
  { id: "rev-15-4", spaceId: "place-15", userId: "user-mira",    rating: 2, content: "Showers are filthy and the air conditioning hasn't worked in months. Vibes are fine, hygiene is not.", createdAt: D, updatedAt: D },
  // place-16: Sober Sundays
  { id: "rev-16-1", spaceId: "place-16", userId: "user-robin",   rating: 5, content: "Finally an LGBT space that doesn't revolve around drinking. Game nights are a riot.", createdAt: D, updatedAt: D },
  { id: "rev-16-2", spaceId: "place-16", userId: "user-tobias",  rating: 4, content: "Came as a sober gay man and finally felt like both parts of me belonged in one room. Rare combo to find.", createdAt: D, updatedAt: D },
  { id: "rev-16-3", spaceId: "place-16", userId: "user-charlie", rating: 5, content: "As someone in recovery this place is a lifeline.", createdAt: D, updatedAt: D },
  { id: "rev-16-4", spaceId: "place-16", userId: "user-anna",    rating: 1, content: "Booked a table for ten for my birthday. Showed up to find it given to walk-ins. Owner shrugged. Spent my birthday standing.", createdAt: D, updatedAt: D },
  // place-17: Pride Lift Club
  { id: "rev-17-1", spaceId: "place-17", userId: "user-theo",    rating: 5, content: "Hit my first competition platform here. The coaches treated me like an athlete from day one, not a trans athlete.", createdAt: D, updatedAt: D },
  { id: "rev-17-2", spaceId: "place-17", userId: "user-marta",   rating: 5, content: "Women's and trans-only hours are non-negotiable for me and they're protected here. Game changer.", createdAt: D, updatedAt: D },
  { id: "rev-17-3", spaceId: "place-17", userId: "user-jamal",   rating: 4, content: "Pricey, but it's the only gym where my trans flag patch on my bag has never gotten a side-eye.", createdAt: D, updatedAt: D },
  { id: "rev-17-4", spaceId: "place-17", userId: "user-kim",     rating: 5, content: "First gym I've ever been to where the music doesn't make me want to leave, and the locker room doesn't make me brace.", createdAt: D, updatedAt: D },
  { id: "rev-17-5", spaceId: "place-17", userId: "user-sofia",   rating: 2, content: "Programming is great but a new coach hired six months ago dead-named me twice and didn't apologise the second time. Management told me to 'give him time'. Not coming back unless he's gone.", createdAt: D, updatedAt: D },
  // place-18: The Locker Room
  { id: "rev-18-1", spaceId: "place-18", userId: "user-oskar",   rating: 3, content: "It's just a gym. Lots of cis straight guys, but they mostly mind their own if you do too.", createdAt: D, updatedAt: D },
  { id: "rev-18-2", spaceId: "place-18", userId: "user-diego",   rating: 4, content: "Equipment is great. The 'lads lads lads' energy means I keep my pronoun pin off my gym bag here.", createdAt: D, updatedAt: D },
  { id: "rev-18-3", spaceId: "place-18", userId: "user-anna",    rating: 2, content: "Got eye-rolled at the squat rack by two guys who clearly thought I shouldn't be there. Off-peak is fine; peak hours are exhausting.", createdAt: D, updatedAt: D },
  { id: "rev-18-4", spaceId: "place-18", userId: "user-felix",   rating: 4, content: "Anonymity works for me as a trans guy passing in public. Nobody talks to anyone. Take that as you will.", createdAt: D, updatedAt: D },
  // place-19: Estudio Verde
  { id: "rev-19-1", spaceId: "place-19", userId: "user-priya",   rating: 5, content: "Teachers actually mean it when they say 'this pose looks however your body needs it to'.", createdAt: D, updatedAt: D },
  { id: "rev-19-2", spaceId: "place-19", userId: "user-sam",     rating: 5, content: "Neutral language throughout — 'lift your chest' not 'show your chest', no 'ladies' calls. Tiny details, huge difference.", createdAt: D, updatedAt: D },
  { id: "rev-19-3", spaceId: "place-19", userId: "user-charlie", rating: 4, content: "Drop-in is fair and there's a quiet trans-affirming Friday class that's helped me reconnect with my body.", createdAt: D, updatedAt: D },
  { id: "rev-19-4", spaceId: "place-19", userId: "user-yusuf",   rating: 4, content: "Small studio, very kind teachers, never any awkward gendered partner work. Book a few days ahead.", createdAt: D, updatedAt: D },
  // place-20: Bar Provence
  { id: "rev-20-1", spaceId: "place-20", userId: "user-sofia",   rating: 4, content: "Came with my girlfriend for our anniversary. Polite, no-fuss service — the bare minimum elsewhere, but here it felt like respect.", createdAt: D, updatedAt: D },
  { id: "rev-20-2", spaceId: "place-20", userId: "user-tobias",  rating: 3, content: "Felt invisible in the best and worst way. Wine is great. Don't expect them to chat.", createdAt: D, updatedAt: D },
  { id: "rev-20-3", spaceId: "place-20", userId: "user-lena",    rating: 5, content: "Owner didn't bat an eye at me and my partner being a same-gender couple. As a couple in our sixties we've experienced the spectrum; this was the quietly affirming end of it.", createdAt: D, updatedAt: D },
  // place-21: Café Bechdel
  { id: "rev-21-1", spaceId: "place-21", userId: "user-mira",    rating: 5, content: "Reading corner is my happy place. They stock zines you can't find anywhere else.", createdAt: D, updatedAt: D },
  { id: "rev-21-2", spaceId: "place-21", userId: "user-charlie", rating: 4, content: "Met half my chosen family at the Sunday lesbian book club they host. Cafe is more like a living room.", createdAt: D, updatedAt: D },
  { id: "rev-21-3", spaceId: "place-21", userId: "user-nadia",   rating: 5, content: "Coffee is good, but the real draw is the conversations you accidentally end up in.", createdAt: D, updatedAt: D },
  { id: "rev-21-4", spaceId: "place-21", userId: "user-hassan",  rating: 1, content: "Got hit with a 'you don't really get the feminist project, do you' from a regular when I dared to disagree about a book. The owner laughed. As a man of colour walking into a 'feminist' space, the gatekeeping was loud. Won't be back.", createdAt: D, updatedAt: D },
  // place-22: Marais Coffee
  { id: "rev-22-1", spaceId: "place-22", userId: "user-yusuf",   rating: 5, content: "Owner remembers regulars by pronoun, not just name. In the heart of Stockholm's gay quarter, exactly as it should be.", createdAt: D, updatedAt: D },
  { id: "rev-22-2", spaceId: "place-22", userId: "user-lena",    rating: 4, content: "Standing room only most days but it's the best people-watching in Söder. Saw three first dates and one breakup in one visit.", createdAt: D, updatedAt: D },
  { id: "rev-22-3", spaceId: "place-22", userId: "user-priya",   rating: 5, content: "Friendly, LGBT-friendly, fast. Exactly what a neighbourhood espresso bar should be.", createdAt: D, updatedAt: D },
  // place-23: FlowMotion Yoga
  { id: "rev-23-1", spaceId: "place-23", userId: "user-sam",     rating: 4, content: "Solid teachers across the board. The LGBT-led Thursday class is its own little world and the reason I keep my membership.", createdAt: D, updatedAt: D },
  { id: "rev-23-2", spaceId: "place-23", userId: "user-tobias",  rating: 3, content: "Big-studio assembly-line vibes in the main classes. Find an inclusive teacher and stick with them.", createdAt: D, updatedAt: D },
  { id: "rev-23-3", spaceId: "place-23", userId: "user-maja",    rating: 4, content: "Gender-neutral changing room is a single small cubicle, so expect a wait. Once you're in, the studio itself is great.", createdAt: D, updatedAt: D },
  { id: "rev-23-4", spaceId: "place-23", userId: "user-felix",   rating: 5, content: "Yin Sunday saved my back after months of binding. Teacher checked in about my body without making it a Thing.", createdAt: D, updatedAt: D },
  // place-24: Spike Volleyball Bar
  { id: "rev-24-1", spaceId: "place-24", userId: "user-diego",   rating: 4, content: "Drop-in volleyball league was way more welcoming than I expected for a straight sports bar. Mixed teams, no weird vibes.", createdAt: D, updatedAt: D },
  { id: "rev-24-2", spaceId: "place-24", userId: "user-anna",    rating: 3, content: "Fun for a group of friends, but my partner and I got plenty of stares as a same-gender couple. Tolerable, not affirming.", createdAt: D, updatedAt: D },
  { id: "rev-24-3", spaceId: "place-24", userId: "user-erik",    rating: 2, content: "Sand court is great in theory. In practice it's full of broken glass on Saturday mornings because nobody cleans up after Friday. Played one game, got a cut, left.", createdAt: D, updatedAt: D },
  // place-25: Lavender Lifts
  { id: "rev-25-1", spaceId: "place-25", userId: "user-charlie", rating: 5, content: "Sliding-scale membership made it possible for me to train consistently for the first time in years.", createdAt: D, updatedAt: D },
  { id: "rev-25-2", spaceId: "place-25", userId: "user-robin",   rating: 5, content: "Coaches asked what my goals were, not what my body's goals were. Eleven years of lifting and this is the first place that's happened.", createdAt: D, updatedAt: D },
  { id: "rev-25-3", spaceId: "place-25", userId: "user-kim",     rating: 4, content: "Class caps mean the whole LGBT crew there knows each other. Small space, big chosen-family energy.", createdAt: D, updatedAt: D },
  { id: "rev-25-4", spaceId: "place-25", userId: "user-nadia",   rating: 5, content: "Left my first class feeling lighter, not just sorer. Turns out training in an un-misgendered room changes things.", createdAt: D, updatedAt: D },
  { id: "rev-25-5", spaceId: "place-25", userId: "user-marta",   rating: 4, content: "Wish for more open-gym hours, but the coached programming is genuinely the best in the city.", createdAt: D, updatedAt: D },
  // place-26: Solidaridad Kitchen
  { id: "rev-26-1", spaceId: "place-26", userId: "user-priya",   rating: 5, content: "Ceviche better than anything I had in Lima last year. They sat me at the bar when I came in alone.", createdAt: D, updatedAt: D },
  { id: "rev-26-2", spaceId: "place-26", userId: "user-sam",     rating: 4, content: "LGBT-owned and it shows in every detail — the music, the menu notes, the way the staff treats everyone.", createdAt: D, updatedAt: D },
  { id: "rev-26-3", spaceId: "place-26", userId: "user-diego",   rating: 5, content: "Brought my novio and the server wished us a beautiful evening without skipping a beat. The arepas are reason enough.", createdAt: D, updatedAt: D },
  { id: "rev-26-4", spaceId: "place-26", userId: "user-yusuf",   rating: 4, content: "Loud and full of joy. Ended up sharing a table with a drag queen between sets at a nearby bar.", createdAt: D, updatedAt: D },
  // place-27: Page & Pride Bookstore
  { id: "rev-27-1", spaceId: "place-27", userId: "user-mira",    rating: 5, content: "Three trans memoirs I couldn't get anywhere else. Staff recommendations are next-level.", createdAt: D, updatedAt: D },
  { id: "rev-27-2", spaceId: "place-27", userId: "user-charlie", rating: 5, content: "Monthly LGBT poetry night. I read here for the first time. The crowd was kind.", createdAt: D, updatedAt: D },
  { id: "rev-27-3", spaceId: "place-27", userId: "user-erik",    rating: 4, content: "Small but every shelf is curated with care. Children's section has rainbow families.", createdAt: D, updatedAt: D },
  { id: "rev-27-4", spaceId: "place-27", userId: "user-anna",    rating: 4, content: "Came in for one book, left with five. Staff just gets it.", createdAt: D, updatedAt: D },
  // place-28: Cinéma du Coin
  { id: "rev-28-1", spaceId: "place-28", userId: "user-lena",    rating: 4, content: "Monthly LGBT film festival is the highlight of my Stockholm calendar. Seats creak; the curation is gold.", createdAt: D, updatedAt: D },
  { id: "rev-28-2", spaceId: "place-28", userId: "user-diego",   rating: 5, content: "Watched a Pedro Almodóvar retrospective here over a weekend. Cried in public, no one made it weird.", createdAt: D, updatedAt: D },
  { id: "rev-28-3", spaceId: "place-28", userId: "user-sofia",   rating: 4, content: "Tiny theatre with character. Bring a cushion. Worth it for the rare prints they show.", createdAt: D, updatedAt: D },
  { id: "rev-28-4", spaceId: "place-28", userId: "user-tobias",  rating: 5, content: "First place I saw a film where the trans character wasn't tragic. Post-screening discussion was genuine, not performative.", createdAt: D, updatedAt: D },
  // place-29: Pride Health
  { id: "rev-29-1", spaceId: "place-29", userId: "user-felix",   rating: 5, content: "First GP who didn't flinch when I explained my body. Genuinely helped me transition my care.", createdAt: D, updatedAt: D },
  { id: "rev-29-2", spaceId: "place-29", userId: "user-robin",   rating: 5, content: "Free STI testing without a single intrusive question. The intake form has pronouns and chosen name fields up top.", createdAt: D, updatedAt: D },
  { id: "rev-29-3", spaceId: "place-29", userId: "user-kim",     rating: 4, content: "Wait times can be long but every staff member is trauma-informed. Worth it.", createdAt: D, updatedAt: D },
  { id: "rev-29-4", spaceId: "place-29", userId: "user-sam",     rating: 5, content: "Reception called me by my chosen name before I even asked. Cried in the waiting room. Good cry.", createdAt: D, updatedAt: D },
  { id: "rev-29-5", spaceId: "place-29", userId: "user-hassan",  rating: 2, content: "Care is excellent once you're in. Getting in is months. The waitlist for trans care is over a year. Nobody's fault here is the clinic's, but the system is failing the people this place is built to serve.", createdAt: D, updatedAt: D },
  // place-30: Studio Trim
  { id: "rev-30-1", spaceId: "place-30", userId: "user-charlie", rating: 5, content: "Flat-rate pricing regardless of length or gender. First salon I haven't dreaded in a decade.", createdAt: D, updatedAt: D },
  { id: "rev-30-2", spaceId: "place-30", userId: "user-theo",    rating: 5, content: "Asked what I wanted, not what they thought I needed. Walked out with the haircut I'd been describing for years.", createdAt: D, updatedAt: D },
  { id: "rev-30-3", spaceId: "place-30", userId: "user-maja",    rating: 4, content: "Stylists listen. The undercut I asked for was the undercut I got.", createdAt: D, updatedAt: D },
  { id: "rev-30-4", spaceId: "place-30", userId: "user-hassan",  rating: 4, content: "Music is good, vibes are inclusive, no awkward small talk about wives or girlfriends.", createdAt: D, updatedAt: D },
  // place-31: House of Glitter
  { id: "rev-31-1", spaceId: "place-31", userId: "user-nadia",   rating: 5, content: "Wednesday lesbian nights are sacred. Door staff is firm but kind. Security will walk you to your Uber.", createdAt: D, updatedAt: D },
  { id: "rev-31-2", spaceId: "place-31", userId: "user-diego",   rating: 4, content: "Best dance floor since Madrid. The crowd is mixed, the music is inclusive, the bathroom queue is chaos in the best way.", createdAt: D, updatedAt: D },
  { id: "rev-31-3", spaceId: "place-31", userId: "user-robin",   rating: 5, content: "Gender-neutral bathrooms with full-length stalls. Step-free entrance and a viewing platform that doesn't require stairs. After ten years of clubbing I finally feel like I belong on the dance floor.", createdAt: D, updatedAt: D },
  { id: "rev-31-4", spaceId: "place-31", userId: "user-anna",    rating: 4, content: "Cover is steep, drinks are reasonable, security genuinely cares. Felt safer here than at most 'mainstream' clubs.", createdAt: D, updatedAt: D },
  // place-32: Modern Art Forum
  { id: "rev-32-1", spaceId: "place-32", userId: "user-sam",     rating: 5, content: "Current exhibition is entirely Black LGBT artists. The curation is fearless and the wall texts don't apologise for the work.", createdAt: D, updatedAt: D },
  { id: "rev-32-2", spaceId: "place-32", userId: "user-yusuf",   rating: 4, content: "Quiet, free entry one Thursday a month, and the guard is the most patient art-explainer in Göteborg.", createdAt: D, updatedAt: D },
  { id: "rev-32-3", spaceId: "place-32", userId: "user-mira",    rating: 5, content: "Sat in front of one piece for forty minutes during the sensory-friendly hour. No one rushed me. The bench was placed exactly where it should be.", createdAt: D, updatedAt: D },
  { id: "rev-32-4", spaceId: "place-32", userId: "user-hassan",  rating: 3, content: "Smaller than I expected and the cafe is overpriced. But the gallery itself? Worth the visit.", createdAt: D, updatedAt: D },
  // place-33: Sankt Hans Park
  { id: "rev-33-1", spaceId: "place-33", userId: "user-erik",    rating: 5, content: "Sunday drag picnics in summer turn this park into the best public space in Lund.", createdAt: D, updatedAt: D },
  { id: "rev-33-2", spaceId: "place-33", userId: "user-anna",    rating: 4, content: "Big enough to find a quiet corner, central enough to walk to. Felt safe even after dark — rare.", createdAt: D, updatedAt: D },
  { id: "rev-33-3", spaceId: "place-33", userId: "user-felix",   rating: 4, content: "Cycled here for the LGBT skate meet. Found my people on a Wednesday at six. Now I come every week.", createdAt: D, updatedAt: D },
  { id: "rev-33-4", spaceId: "place-33", userId: "user-linnea",  rating: 5, content: "Picnicked with my girlfriend, no stares, just dogs and other queers and the smell of grass.", createdAt: D, updatedAt: D },
  // place-34: La Cantine
  { id: "rev-34-1", spaceId: "place-34", userId: "user-diego",   rating: 5, content: "Came alone, ended up chatting with the chef about her partner's home cooking. Duck confit is reason enough to return.", createdAt: D, updatedAt: D },
  { id: "rev-34-2", spaceId: "place-34", userId: "user-lena",    rating: 4, content: "Lyonnaise classics. LGBT owner with a rainbow sticker on the door and a Pride flag behind the bar.", createdAt: D, updatedAt: D },
  { id: "rev-34-3", spaceId: "place-34", userId: "user-priya",   rating: 5, content: "Vegan option that's actually thoughtful, not a sad salad. Brought my parents and they cried over the dessert.", createdAt: D, updatedAt: D },
  { id: "rev-34-4", spaceId: "place-34", userId: "user-jamal",   rating: 1, content: "Two hours on the waiting list with a reservation, then seated at a table next to the bathroom. Server forgot two of our orders. The 'LGBT-owned' bit doesn't excuse the service. Disappointing.", createdAt: D, updatedAt: D },
  // place-35: Rainbow Hostel
  { id: "rev-35-1", spaceId: "place-35", userId: "user-sam",     rating: 5, content: "Three nights as a non-binary solo traveller. The dorms have a gender-inclusive option and the staff meant it.", createdAt: D, updatedAt: D },
  { id: "rev-35-2", spaceId: "place-35", userId: "user-charlie", rating: 4, content: "Common room hosts LGBT mixers twice a week. Made friends I'll see again. Beds firm, walls thin, vibe is everything.", createdAt: D, updatedAt: D },
  { id: "rev-35-3", spaceId: "place-35", userId: "user-yusuf",   rating: 5, content: "Owner is a trans guy who's been backpacking for thirty years. His tips for safe travel were better than any guidebook.", createdAt: D, updatedAt: D },
  { id: "rev-35-4", spaceId: "place-35", userId: "user-nadia",   rating: 3, content: "Wifi is bad and bathrooms are shared. For the price and the community though, I'd come back tomorrow.", createdAt: D, updatedAt: D },
];

// ─── Media (one hero image per space) ────────────────────────────────────────

export const media: Media[] = spaces
  .filter((p) => p.imageUrl)
  .map((p, i) => ({
    id: `media-${i + 1}`,
    url: p.imageUrl!,
    spaceId: p.id,
    createdAt: D,
    updatedAt: D,
  }));

// ─── Ratings (derived from reviews — one rating per review) ───────────────────

export const ratings: Rating[] = reviews
  .filter((r) => r.userId !== null)
  .map((r, i) => ({
    id: `rating-${i + 1}`,
    value: r.rating,
    userId: r.userId!,
    spaceId: r.spaceId,
    createdAt: D,
    updatedAt: D,
  }));

// ─── Accessibility infos ──────────────────────────────────────────────────────

export const accessibilityInfos: AccessibilityInfo[] = [
  { id: "acc-1",  name: "wheelchair-accessible", userId: null, spaceId: null, createdAt: D, updatedAt: D },
  { id: "acc-2",  name: "step-free",              userId: null, spaceId: null, createdAt: D, updatedAt: D },
  { id: "acc-3",  name: "accessible-bathroom",    userId: null, spaceId: null, createdAt: D, updatedAt: D },
  { id: "acc-4",  name: "pool-hoist",             userId: null, spaceId: null, createdAt: D, updatedAt: D },
  { id: "acc-5",  name: "automatic-doors",        userId: null, spaceId: null, createdAt: D, updatedAt: D },
  { id: "acc-6",  name: "large-print",            userId: null, spaceId: null, createdAt: D, updatedAt: D },
  { id: "acc-7",  name: "captions",               userId: null, spaceId: null, createdAt: D, updatedAt: D },
  { id: "acc-8",  name: "adaptive-routes",        userId: null, spaceId: null, createdAt: D, updatedAt: D },
  { id: "acc-9",  name: "sensory-friendly",       userId: null, spaceId: null, createdAt: D, updatedAt: D },
  { id: "acc-10", name: "low-noise",              userId: null, spaceId: null, createdAt: D, updatedAt: D },
];

// ─── Empty collections (no seed data needed) ─────────────────────────────────

export const favorites: Favorite[] = [];
export const reports: Report[] = [];
