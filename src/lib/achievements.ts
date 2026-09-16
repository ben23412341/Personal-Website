export type Achievement = {
  title: string;
  /** Shown under the title, e.g. the team or the race distance */
  detail?: string;
  year: string;
  links?: { label: string; href: string }[];
};

/**
 * Newest year first; the section groups consecutive entries by year. Within a
 * year: school athletics awards, OFSAA, club soccer, academics, then
 * competitions. Only the home page's achievements section reads from here.
 */
export const achievements: Achievement[] = [
  // 2026
  {
    title: "Junior Male Athlete of the Year",
    detail: "St. Patrick CSS",
    year: "2026",
  },
  {
    title: "Junior Boys Track and Field MVP",
    detail: "St. Patrick CSS",
    year: "2026",
  },
  {
    title: "Junior Boys Soccer MVP",
    detail: "St. Patrick CSS",
    year: "2026",
  },
  {
    title: "Junior Boys Cross-Country MVP",
    detail: "St. Patrick CSS",
    year: "2026",
  },
  {
    title: "16th Place at OFSAA Track and Field",
    detail: "3000 m",
    year: "2026",
  },
  {
    title: "Gael's Cup Champion",
    detail: "Cherry Beach Blackhawks",
    year: "2026",
  },
  {
    title: "1st Place in the TKS x Lovable Challenge",
    detail: "Toronto cohort",
    year: "2026",
    links: [
      { label: "Certificate", href: "/work/tks-lovable-certificate.png" },
      { label: "Project", href: "/work/tks-lovable-challenge" },
    ],
  },

  // 2025
  {
    title: "4th Place Team at OFSAA Cross-Country",
    detail: "St. Patrick CSS",
    year: "2025",
  },
  { title: "20th Place at OFSAA Cross-Country", year: "2025" },
  {
    title: "14th Place at OFSAA Track and Field",
    detail: "3000 m",
    year: "2025",
  },
  {
    title: "Gael's Cup Champion",
    detail: "Cherry Beach Greyhawks",
    year: "2025",
  },
  {
    title: "Umbro Top Rated Series Challenge Cup Champion",
    detail: "Cherry Beach Blackhawks",
    year: "2025",
  },
  {
    title: "IModel C2 Champion",
    detail: "Cherry Beach Blackhawks",
    year: "2025",
  },
  {
    title: "90%+ Overall High School Average",
    detail: "St. Patrick CSS",
    year: "2025",
  },
  {
    title: "Academic Award in French",
    detail: "Highest school average",
    year: "2025",
  },
  { title: "Honour Roll", year: "2025" },

  // 2024
  {
    title: "3rd Place Team at OFSAA Cross-Country",
    detail: "Neil McNeil",
    year: "2024",
  },
  { title: "37th Place at OFSAA Cross-Country", year: "2024" },
  {
    title: "2nd Place in the National Let's Talk Science Challenge",
    year: "2024",
  },
  {
    title: "1st Place in the International FLUOR Engineering Challenge",
    year: "2024",
  },

  // 2023
  {
    title: "1st Place in the National Let's Talk Science Challenge",
    year: "2023",
  },
  {
    title: "1st Place in the International FLUOR Engineering Challenge",
    year: "2023",
  },
  {
    title: "Perfect Score in the International Beaver Computing Challenge",
    year: "2023",
  },

  // 2022
  {
    title: "5th Place in the International FLUOR Engineering Challenge",
    year: "2022",
  },
  {
    title: "Perfect Score in the International Beaver Computing Challenge",
    year: "2022",
  },
];
