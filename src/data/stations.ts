export interface Station {
  id: string;
  name: string;
  tagline: string;
  genre: string;
  streamUrl: string;
  color: string;
}

export const stations: Station[] = [
  { id: "station-1", name: "The Hits", tagline: "Today's Top Hits", genre: "Pop", streamUrl: "#", color: "199 89% 48%" },
  { id: "station-2", name: "Classic Rock", tagline: "Legends Never Die", genre: "Rock", streamUrl: "#", color: "0 84% 60%" },
  { id: "station-3", name: "Smooth Jazz", tagline: "Relax & Unwind", genre: "Jazz", streamUrl: "#", color: "45 93% 47%" },
  { id: "station-4", name: "Electronic Beats", tagline: "Feel The Bass", genre: "Electronic", streamUrl: "#", color: "280 73% 55%" },
  { id: "station-5", name: "Country Roads", tagline: "Heart & Soul", genre: "Country", streamUrl: "#", color: "25 95% 53%" },
  { id: "station-6", name: "Hip Hop Nation", tagline: "Pure Fire", genre: "Hip Hop", streamUrl: "#", color: "340 82% 52%" },
  { id: "station-7", name: "Classical Masters", tagline: "Timeless Beauty", genre: "Classical", streamUrl: "#", color: "220 70% 50%" },
  { id: "station-8", name: "Indie Vibes", tagline: "Discover New Sounds", genre: "Indie", streamUrl: "#", color: "160 84% 39%" },
  { id: "station-9", name: "R&B Soul", tagline: "Smooth Grooves", genre: "R&B", streamUrl: "#", color: "300 76% 50%" },
  { id: "station-10", name: "Latin Heat", tagline: "Feel The Rhythm", genre: "Latin", streamUrl: "#", color: "15 90% 55%" },
  { id: "station-11", name: "Chill Lounge", tagline: "Ambient Escape", genre: "Chill", streamUrl: "#", color: "180 70% 45%" },
  { id: "station-12", name: "Throwback Jams", tagline: "Best of the 80s & 90s", genre: "Retro", streamUrl: "#", color: "260 70% 55%" },
];

export const getStationById = (id: string): Station | undefined => {
  return stations.find(station => station.id === id);
};
