import { siteConfig } from "@/lib/site-config";

export type Experience = {
  /** URL segment: /experience/<slug> */
  slug: string;
  period: string;
  role: string;
  org: string;
  /** One line — shown on the card */
  summary: string;
  /** Full write-up — shown on the detail page */
  body: string[];
  highlights: string[];
  stack: string[];
  links?: { label: string; href: string }[];
};

/**
 * Most recent first, with ongoing roles at the top. The section and the
 * /experience/[slug] pages both read from here, and the grid reflows to
 * however many entries you leave.
 */
export const experiences: Experience[] = [
  {
    slug: "cherry-beach-soccer-camps",
    period: "Fall 2025 to Present",
    role: "Soccer Camp Volunteer",
    org: "Cherry Beach Soccer Club",
    summary:
      "Volunteering at the youth camps run by my club of over eight years.",
    body: [
      "Cherry Beach Soccer Club is where I play competitive soccer, and I have been with the club for over eight years. Along with its teams, the club runs soccer camps for kids through the year.",
      "I volunteered at those camps in Fall 2025 and will keep doing so whenever I get the chance.",
    ],
    highlights: [
      "Volunteered at club camps in Fall 2025",
      "Competitive player at the club for over eight years",
      "Returning whenever I get the chance",
    ],
    stack: [
      "Working with kids",
      "Leadership",
      "Communication",
      "Teamwork",
      "Soccer",
    ],
    links: [
      {
        label: "cherrybeachsoccer.ca",
        href: "https://www.cherrybeachsoccer.ca/",
      },
    ],
  },
  {
    slug: "educational-content",
    period: "Nov 2025 to Present",
    role: "Content Creator",
    org: "YouTube and Medium",
    summary: "Making educational videos and articles on YouTube and Medium.",
    body: [
      "I make educational videos on YouTube and write educational articles on Medium. I also post my files on GitHub, including the code for my projects.",
      "Most of it is about AI. I have written about the energy cost of AI and why nuclear fusion could be the answer, how I built an AI powered trash sorting robot, and the AI traffic system behind Mercura. The videos show how the trash sorting robot works and how to build one.",
    ],
    highlights: [
      "Educational articles on AI, from fusion energy to traffic optimization",
      "Videos on how my AI trash sorting robot works and how to build it",
      "Code for my projects posted on GitHub",
    ],
    stack: [
      "Technical writing",
      "Video production",
      "Science communication",
      "Research",
      "AI",
      "Git and GitHub",
    ],
    links: [
      { label: "YouTube", href: siteConfig.socials.youtube },
      { label: "Medium", href: siteConfig.socials.medium },
      { label: "GitHub", href: siteConfig.socials.github },
    ],
  },
  {
    slug: "tks",
    period: "Sep 2025 to Jun 2026",
    role: "TKS Innovator",
    org: "The Knowledge Society",
    summary:
      "A selective ten month accelerator for ambitious teenagers.",
    body: [
      "TKS, The Knowledge Society, is a ten month accelerator for teenagers aged 13 to 17 that runs from September to June, and it calls its students innovators. I did TKS Innovate in Toronto for the 2025 to 2026 year. Getting in is selective: about 40% of applicants are invited to an interview, and only about 15% make it into the program after interviews.",
      "Over the year I learned a lot about a wide variety of topics. The program covers everything from emerging technologies like AI, biotech, robotics and quantum computing to mental models like first principles thinking.",
      "In TKS your focus is the area you go deep on through your own projects and articles. Mine was AI, which meant building AI projects and writing articles about them.",
      "I also did projects through the program's challenges, which are built around real companies. Those included the TKS x Microsoft Challenge on data centre efficiency and the TKS x Lovable Challenge on growing Lovable without paid acquisition.",
    ],
    highlights: [
      "Focused on AI, with projects and articles on it",
      "Learned across a wide variety of topics, from AI to business strategy",
      "Won the Toronto cohort of the TKS x Lovable Challenge",
    ],
    stack: [
      "AI",
      "Technical writing",
      "Presenting",
      "Market research",
      "Financial modelling",
      "Growth strategy",
      "Systems design",
      "Prototyping",
      "Team collaboration",
    ],
    links: [
      {
        label: "tks.world",
        href: "https://www.tks.world/",
      },
      {
        label: "TKS x Lovable Challenge",
        href: "/work/tks-lovable-challenge",
      },
      {
        label: "TKS x Microsoft Challenge",
        href: "/work/tks-microsoft-challenge",
      },
    ],
  },
  {
    slug: "raise-a-roof-jamaica",
    period: "March Break 2026",
    role: "Volunteer House Builder",
    org: "Raise a Roof Jamaica",
    summary:
      "Built three houses for those in need and repaired a hurricane-hit roof in Jamaica.",
    body: [
      "Over March Break 2026 I travelled to Jamaica with Raise a Roof Jamaica, as part of a group of Ontario high school students and adult volunteers. We built three houses for families in need outside Kingston.",
      "We also repaired a community building in St. Elizabeth whose roof was destroyed by Hurricane Melissa in October 2025. Melissa was the strongest hurricane on record to strike Jamaica. It tore the roofs off about 120,000 structures, and St. Elizabeth was one of the parishes hit hardest.",
      "The group fundraised to cover volunteer travel and the construction materials, which were bought in Kingston.",
    ],
    highlights: [
      "Built three houses for families in need",
      "Repaired a community building's roof after Hurricane Melissa",
    ],
    stack: ["Construction", "Carpentry", "Roofing", "Teamwork"],
    links: [
      {
        label: "Fundraiser",
        href: "https://www.spotfund.com/story/3e7d6c45-e69e-46c5-9746-b5a9b429af9a",
      },
    ],
  },
  {
    slug: "costa-rica-trip-fundraiser",
    period: "Summer 2025",
    role: "Fundraising Volunteer",
    org: "Cherry Beach Soccer Club",
    summary: "Helped raise money for my soccer team's trip to Costa Rica.",
    body: [
      "In Summer 2025 I helped run a fundraiser for my team at Cherry Beach Soccer Club, to help pay for our trip to Costa Rica in February 2026.",
      "I helped set up and run a temporary snack bar outside the soccer field, and I handled the money and the accounting for it.",
      "I also designed the tour book for the trip, with player profiles, the itinerary, a sponsor page and advertisements, and helped design trip clothing and accessories for the players.",
    ],
    highlights: [
      "Helped run a temporary snack bar and handled its money and accounting",
      "Designed the tour book, with player profiles, itinerary, sponsor page and ads",
      "Helped design trip clothing and accessories for the players",
    ],
    stack: [
      "Fundraising",
      "Graphic design",
      "Accounting",
      "Cash handling",
      "Customer service",
      "Apparel design",
      "Teamwork",
    ],
    links: [
      {
        label: "cherrybeachsoccer.ca",
        href: "https://www.cherrybeachsoccer.ca/",
      },
    ],
  },
  {
    slug: "st-anns-food-bank",
    period: "January to May 2025",
    role: "Food Bank Volunteer",
    org: "St. Ann's Parish Food Bank",
    summary: "Helped walk clients through the food bank and get their food.",
    body: [
      "From January to May 2025 I volunteered at the food bank at St. Ann's Parish in Toronto. It gives out food on Saturday mornings and serves more than 180 people every week.",
      "I helped walk clients through the food bank and get them their food. Alongside that, I stocked the shelves and tables the food was given out from, and broke down boxes so they could be recycled.",
    ],
    highlights: [
      "Walked clients through a food bank that serves over 180 people a week",
    ],
    stack: [
      "Client service",
      "Communication",
      "Working with the public",
      "Shelf stocking",
      "Teamwork",
    ],
    links: [
      {
        label: "St. Ann's food bank",
        href: "https://stannsto.archtoronto.org/en/our-ministries/food-bank-service/",
      },
    ],
  },
];

export const getExperience = (slug: string) =>
  experiences.find((item) => item.slug === slug);
