// ─── Types (backend-ready structure) ───

export interface Folder {
  id: string;
  title: string;
  image: string;
  color: string;
  photoCount: number;
  createdAt: string;
  isLocked: boolean;
  photos: Photo[];
}

export interface Album {
  id: string;
  title: string;
  image: string;
  category: string;
  photoCount: number;
  createdAt: string;
  isCollaborative: boolean;
  isPrivate: boolean;
  theme: string;
  photos: Photo[];
  notes: Note[];
  music: string | null;
}

export interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
  place: string;
  event: string;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  message: string;
  linkedTo: string | null;
  linkedType: "folder" | "album" | null;
}

export interface UserProfile {
  name: string;
  avatar: string;
  banner: string;
  language: string;
  themeColor: string;
  font: string;
  plan: "free" | "medium" | "premium";
}

export interface DashboardStats {
  folders: number;
  albums: number;
  media: number;
  reminders: number;
  storageUsed: string;
  plan: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  isCurrent: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ─── AI-ready placeholders ───
export interface AICapability {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

export const aiCapabilities: AICapability[] = [
  { id: "ai-removal", name: "AI Object Removal", description: "Remove unwanted objects from photos", available: false },
  { id: "ai-enhance", name: "AI Photo Enhance", description: "Automatically enhance photo quality", available: false },
  { id: "ai-organize", name: "AI Smart Organize", description: "Auto-sort photos by event, place, date", available: false },
  { id: "ai-recognition", name: "AI Face Recognition", description: "Identify and tag people in photos", available: false },
  { id: "ai-style", name: "AI Style Transfer", description: "Apply artistic styles to photos", available: false },
];

// ─── Mock placeholder images ───
const placeholderPhoto = (seed: number) =>
  `https://picsum.photos/seed/${seed}/300/300`;

// ─── Mock photos factory ───
const makeMockPhotos = (count: number, prefix: string): Photo[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-photo-${i}`,
    url: placeholderPhoto(Math.abs(prefix.charCodeAt(0) * 100 + i)),
    title: `Photo ${i + 1}`,
    date: `2024-0${(i % 9) + 1}-${10 + (i % 20)}`,
    place: ["London", "Paris", "Lagos", "New York", "Tokyo"][i % 5],
    event: ["Birthday", "Wedding", "Holiday", "Family", "Reunion"][i % 5],
  }));

// ─── Import assets ───
import cardBirthdays from "@/assets/card_birthdays.png";
import cardBirthRobert from "@/assets/card_birth_robert.png";
import cardFamily from "@/assets/card_family.png";
import cardFriends from "@/assets/card_friends.png";
import cardHolidays from "@/assets/card_holidays.png";
import cardChristmas from "@/assets/card_christmas.png";
import cardDadRemembrance from "@/assets/card_dad_remembrance.jpg";
import cardMumRemembrance from "@/assets/card_mum_remembrance.jpg";
import cardTwinsBirth from "@/assets/card_twins_birth.jpg";
import cardWifeBirthday from "@/assets/card_wife_birthday.jpg";
import cardClaraBday from "@/assets/card_clara_bday.jpg";
import cardTomMarriage from "@/assets/card_tom_marriage.jpg";
import avatar from "@/assets/avatar.png";

// ─── Mock Folders ───
export const mockFolders: Folder[] = [
  { id: "birthdays", title: "Birthdays", image: cardBirthdays, color: "#e8b4b8", photoCount: 24, createdAt: "2024-01-15", isLocked: false, photos: makeMockPhotos(24, "bday") },
  { id: "birth-robert", title: "Birth of Robert", image: cardBirthRobert, color: "#c9a9d2", photoCount: 18, createdAt: "2024-02-20", isLocked: false, photos: makeMockPhotos(18, "robert") },
  { id: "family", title: "Family", image: cardFamily, color: "#a9c9d2", photoCount: 32, createdAt: "2024-03-10", isLocked: false, photos: makeMockPhotos(32, "family") },
  { id: "friends", title: "Friends", image: cardFriends, color: "#d2c9a9", photoCount: 15, createdAt: "2024-04-05", isLocked: false, photos: makeMockPhotos(15, "friends") },
  { id: "holidays", title: "Holidays", image: cardHolidays, color: "#b8d2a9", photoCount: 42, createdAt: "2024-05-12", isLocked: false, photos: makeMockPhotos(42, "holidays") },
  { id: "christmas", title: "Christmas", image: cardChristmas, color: "#d2a9b8", photoCount: 28, createdAt: "2024-06-25", isLocked: false, photos: makeMockPhotos(28, "xmas") },
];

// ─── Mock Albums ───
export const mockAlbums: Album[] = [
  { id: "dad-remembrance", title: "My Wife Birthday", image: "/album-covers/album-wife-birthday.png", category: "Memorial", photoCount: 20, createdAt: "2024-01-10", isCollaborative: true, isPrivate: false, theme: "classic", photos: makeMockPhotos(20, "dadrem"), notes: [{ id: "n1", text: "Forever in our hearts ❤️", createdAt: "2024-01-10" }], music: "Amazing Grace" },
  { id: "mum-remembrance", title: "Sandy Birth", image: "/album-covers/album-baby.png", category: "Memorial", photoCount: 16, createdAt: "2024-02-14", isCollaborative: false, isPrivate: true, theme: "elegant", photos: makeMockPhotos(16, "mumrem"), notes: [], music: null },
  { id: "twins-birth", title: "Julie Graduation", image: "/album-covers/album-twins.png", category: "Birth", photoCount: 35, createdAt: "2024-03-22", isCollaborative: true, isPrivate: false, theme: "playful", photos: makeMockPhotos(35, "twins"), notes: [{ id: "n2", text: "Welcome to the world! 👶👶", createdAt: "2024-03-22" }], music: "Twinkle Twinkle" },
  { id: "wife-birthday", title: "My Wife Birthday", image: "/album-covers/album-emily.png", category: "Birthday", photoCount: 22, createdAt: "2024-04-18", isCollaborative: false, isPrivate: false, theme: "romantic", photos: makeMockPhotos(22, "wifebday"), notes: [], music: "Happy Birthday" },
  { id: "clara-bday", title: "Amanda & Kevin Mariage", image: "/album-covers/album-rings.png", category: "Birthday", photoCount: 14, createdAt: "2024-05-30", isCollaborative: true, isPrivate: false, theme: "fun", photos: makeMockPhotos(14, "clara"), notes: [], music: null },
  { id: "tom-marriage", title: "Dan Remembrance", image: "/album-covers/album-wedding-board.png", category: "Wedding", photoCount: 48, createdAt: "2024-06-15", isCollaborative: true, isPrivate: false, theme: "classic", photos: makeMockPhotos(48, "tom"), notes: [{ id: "n3", text: "Best wedding ever! 💒", createdAt: "2024-06-15" }], music: "Canon in D" },
];

export function normalizeAlbums(albums: Album[]): Album[] {
  const seededIds = new Set(mockAlbums.map((album) => album.id));
  const normalizedSeeded = mockAlbums.map((seedAlbum) => {
    const savedAlbum = albums.find((album) => album.id === seedAlbum.id);
    if (!savedAlbum) return seedAlbum;

    return {
      ...savedAlbum,
      title: seedAlbum.title,
      image: seedAlbum.image,
      category: seedAlbum.category,
      isCollaborative: seedAlbum.isCollaborative,
      theme: savedAlbum.theme || seedAlbum.theme,
      createdAt: savedAlbum.createdAt || seedAlbum.createdAt,
    };
  });

  const extraAlbums = albums.filter((album) => !seededIds.has(album.id));
  return [...normalizedSeeded, ...extraAlbums];
}

// ─── Mock Reminders ───
export const mockReminders: Reminder[] = [
  { id: "r1", title: "Julie's Wedding", date: "2026-04-04", message: "Don't forget to prepare the album!", linkedTo: "tom-marriage", linkedType: "album" },
  { id: "r2", title: "Clara's Birthday", date: "2026-05-30", message: "Create birthday album for Clara", linkedTo: "clara-bday", linkedType: "album" },
  { id: "r3", title: "Family Reunion Photos", date: "2026-06-10", message: "Collect photos from everyone", linkedTo: "family", linkedType: "folder" },
];

// ─── Mock User Profile ───
export const mockUser: UserProfile = {
  name: "Julie",
  avatar,
  banner: placeholderPhoto(999),
  language: "English",
  themeColor: "#5665c9",
  font: "Default",
  plan: "free",
};

// ─── Dashboard Stats ───
export const mockDashboardStats: DashboardStats = {
  folders: mockFolders.length,
  albums: mockAlbums.length,
  media: mockFolders.reduce((a, f) => a + f.photoCount, 0) + mockAlbums.reduce((a, al) => a + al.photoCount, 0),
  reminders: mockReminders.length,
  storageUsed: "2.4 GB / 5 GB",
  plan: "Free",
};

// ─── Pricing Plans ───
export const mockPricingPlans: (PricingPlan & { priceId?: string })[] = [
  { id: "free", name: "Free", price: "£0", features: ["5 GB Storage", "3 Photo Folders", "Basic Editing", "Basic Sharing"], isCurrent: true },
  { id: "basic", name: "Basic", price: "£1.99/mo", features: ["20 GB Storage", "10 Photo Folders", "Basic Editing", "Sharing"], isCurrent: false, priceId: "price_1TTDPJRGCq8kXsN3GmpPDrGh" },
  { id: "medium", name: "Medium", price: "£3.99/mo", features: ["50 GB Storage", "Unlimited Photo Folders", "Advanced Photo and Video Editing (filters, music, text, and more)", "Sharing (links, moments)"], isCurrent: false, priceId: "price_1TTDWGRGCq8kXsN3bKW16QNb" },
  { id: "premium", name: "Premium", price: "£6.99/mo", features: ["Unlimited Storage", "Full Editing", "AI Features (auto-organise, suggestions)", "Collaboration (share memories live)", "Custom Themes", "No Ads"], isCurrent: false, priceId: "price_1TTDbARGCq8kXsN3B9AiSBcs" },
];

// ─── FAQ ───
export const mockFAQ: FAQItem[] = [
  { question: "How do I create a folder?", answer: "Tap 'Create/Import' then select 'Create Folder'. Give it a name and customize it." },
  { question: "Can I share albums with family?", answer: "Yes! Open an album, tap Share, and choose how you'd like to share it." },
  { question: "How does AI editing work?", answer: "Select a photo, open the editor, and use AI tools like Background Remove or Face Enhance." },
  { question: "Is my data private?", answer: "Yes, all your photos and albums are private by default. You control sharing settings." },
  { question: "How do I upgrade my plan?", answer: "Go to Offers in the sidebar menu to see available plans and upgrade." },
];

// ─── Create/Import options ───
export const createImportOptions = [
  { id: "create-folder", label: "Create Folder", icon: "FolderPlus" },
  { id: "create-album", label: "Create Album", icon: "BookPlus" },
  { id: "import-photos", label: "Import Photos", icon: "ImagePlus" },
  { id: "import-videos", label: "Import Videos", icon: "VideoIcon" },
  { id: "import-phone", label: "Import from Phone", icon: "Smartphone" },
  { id: "import-icloud", label: "Import from iCloud", icon: "Cloud" },
  { id: "import-pc", label: "Import from PC", icon: "Monitor" },
  { id: "add-link", label: "Add External Link", icon: "Link" },
  { id: "add-music", label: "Add Music", icon: "Music" },
];
