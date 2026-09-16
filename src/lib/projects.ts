import { Car, Gauge, Heart, Sparkles, Trash2, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ProjectStatus = "shipped" | "founded" | "building" | "concept";

export type Project = {
  /** URL segment: /work/<slug> */
  slug: string;
  title: string;
  year: string;
  category: string;
  status: ProjectStatus;
  /** One or two lines — shown in the orbit panel */
  summary: string;
  /** Full write-up — shown on the project page */
  body: string[];
  stack: string[];
  icon: LucideIcon;
  links?: { label: string; href: string }[];
  /** Shown below the write-up on the project page, in this order */
  images?: {
    src: string;
    alt: string;
    caption?: string;
    width: number;
    height: number;
  }[];
  /** Slugs of related projects */
  related: string[];
};

/**
 * Ordered earliest to latest. Everything the work section and the
 * /work/[slug] pages render comes from this array, so adding or removing an
 * entry updates both.
 */
export const projects: Project[] = [
  {
    slug: "tks-microsoft-challenge",
    title: "TKS x Microsoft Challenge",
    year: "December 2025",
    category: "Consulting challenge",
    status: "shipped",
    icon: Gauge,
    summary:
      "A one week TKS challenge on Microsoft data centres: an operating system that reallocates GPUs in real time, worth $2B+ in yearly revenue and $26M+ in saved energy.",
    body: [
      "TKS, The Knowledge Society, is a ten month innovation program for teenagers that runs challenges with real companies, and I did this one through them. It was their short format: one week from brief to deck, five of us on a team. We took Microsoft data centre efficiency, specifically the GPUs that Azure rents out to run AI workloads. The research, the numbers and the proposal are all ours, put together as a TKS exercise rather than as work done with Microsoft.",
      "The problem is that GPUs are partitioned at job start for worst-case demand and never rebalanced while the job runs. Real workloads fluctuate, so a large share of that reserved compute sits idle, typically leaving utilization somewhere between 45% and 67%. Idle capacity still costs almost the full amount: power delivery, cooling and capital depreciation do not care whether the chip is doing anything. It also means scaling AI means buying more GPUs rather than using the ones already racked.",
      "Our recommendation was an operating system layer that first sorts each GPU into partitionable or passthrough based on how it is being used, then manages workloads across the fleet to hold utilization in an 80% to 90% band, pulling jobs off saturated GPUs and pushing them onto underused ones while they run.",
      "The numbers were where most of the work went. By our modelling, holding that band lifts per-GPU utilization by roughly 57% on average, which turns into about 16% more revenue from the same hardware, or $2.9B+ a year, and $26M+ a year in electricity, about 1.4% of data centre power draw. For scale, a single Azure AI data centre with 20,000 GPUs is leaving around $84M of potential revenue on the table annually. We grounded all of it in NVIDIA Run:ai, academic work on fine-grained GPU sharing, and published large-cluster utilization studies.",
      "We closed with a rollout rather than an idea: one month of design, three to four months of development with a team of 16 to 20 engineers, three to four months testing against selective GPU clusters, then a three to five month phased rollout starting in low-risk data centres. Ten to fifteen months end to end.",
    ],
    // Ranked: the overview panel shows only the first six.
    stack: [
      "Market research",
      "Financial modelling",
      "Systems design",
      "Technical research",
      "Presenting",
      "Slide design",
      "Cost-benefit analysis",
      "GPU computing",
      "Data centre infrastructure",
      "Team collaboration",
    ],
    links: [
      {
        label: "Slide deck",
        href: "https://www.canva.com/d/RajuBePOlBwqpL1",
      },
    ],
    related: ["trash-sorting-robot", "tks-lovable-challenge"],
  },
  {
    slug: "trash-sorting-robot",
    title: "AI Trash Sorting Robot",
    year: "January 2026",
    category: "AI & robotics",
    status: "shipped",
    icon: Trash2,
    summary:
      "A trash can that sees what is being thrown out and puts it in the correct bin, saving you the hassle and keeping recyclables out of the landfill.",
    body: [
      "Styrofoam is the question that started this. Most people do not know whether it is recyclable, so they bin it as garbage to be safe. That instinct scales badly: in Washington D.C. 79% of recyclables end up in the garbage, and roughly a quarter of what goes into the blue bin should never have been there, which costs money to sort back out. Humans are bad at this, so I built something that is not.",
      "The robot is a box with a flat platform on a pivot. You set an item down, a webcam above it feeds the image to a computer vision model, the model calls it garbage or recycling, and a servo tips the platform toward the right bucket.",
      "The classifier is an image model trained in Google's Teachable Machine across five classes (nothing, paper, plastic, can, trash) on a few hundred photos I shot myself, each item captured in several orientations against the same background the robot uses. Whole-image classification was the right call over object detection here: nothing needs to be located, only named, so there was no bounding-box labelling and it runs comfortably on a laptop. The model is exported to TensorFlow.js and served from a local HTTP server, and the browser pushes each verdict over USB serial to an Arduino driving the servo.",
      "The body is cardboard, barbecue skewers and hot glue. The camera mast is deliberately staggered to one side so the webcam looks straight down at the centre of the platform rather than at its own supports, and the platform is folded along its length and skewered internally so it stays rigid while being flung back and forth.",
      "In testing it put items in the correct bin 85% of the time, on only a couple hundred training images. That is already well clear of the 79% and 25% failure rates it was built to beat. A bigger dataset is the obvious way up, and moving the model off a laptop and onto a Raspberry Pi is what would make it something you could actually stand in a kitchen.",
    ],
    // Ranked: the overview panel shows only the first six.
    stack: [
      "Computer vision",
      "Robotics",
      "Model training",
      "TensorFlow.js",
      "Arduino / C++",
      "Mechanical prototyping",
      "Teachable Machine",
      "Serial communication",
      "Servo control",
      "Python",
      "JavaScript",
      "Technical writing",
    ],
    links: [
      {
        label: "GitHub repository",
        href: "https://github.com/ben23412341/AI-Trash-Sorter",
      },
      {
        label: "Write-up: part 1 (software)",
        href: "https://medium.com/@ben23412341/how-i-built-an-ai-powered-trash-sorting-robot-part-1-9a4c3c11c8e3",
      },
      {
        label: "Write-up: part 2 (hardware)",
        href: "https://medium.com/@ben23412341/how-i-built-an-ai-powered-trash-sorting-robot-part-2-fcf163b2f07d",
      },
      {
        label: "Demo",
        href: "https://www.youtube.com/watch?v=DP7QECuASIg",
      },
      {
        label: "Full project video",
        href: "https://www.youtube.com/watch?v=zU7PNbRXMhc",
      },
    ],
    related: ["tks-microsoft-challenge", "tks-lovable-challenge"],
  },
  {
    slug: "tks-lovable-challenge",
    title: "TKS x Lovable Challenge",
    year: "March 2026",
    category: "Consulting challenge",
    status: "shipped",
    icon: Heart,
    summary:
      "A winning TKS challenge recommendation for Lovable: a creator-led template marketplace where every template becomes its own search entry point, modelled at 75M+ new users and $450M+ in annual recurring revenue without paid acquisition.",
    body: [
      "TKS, The Knowledge Society, is a ten month innovation program for teenagers that runs challenges with real companies, and I did this one through them. The company was Lovable, the AI app builder that passed $100 million in annual recurring revenue inside a year and raised a Series B at a $6.6 billion valuation. We took the growth brief: how might Lovable acquire new users without relying on paid acquisition? The challenge itself ran three weeks, and winning your cohort bought you more work rather than less: another stretch on top to prepare for the global presentation.",
      "Lovable was not short of users. It was short of a growth loop, and we split that into three failures. Growth was non-compounding, running on paid ads, outreach and word of mouth, all of which produce linear results and stop the moment the effort stops, typically costing 20% to 30% of annual growth potential. There was no ecosystem, and SaaS products without network effects commonly see 70% to 90% annual churn while community-driven platforms retain users two to three times longer. And there was nothing to discover: with the homepage and paid ads as the main entry points, more than half of the available organic traffic was going uncaptured.",
      "Our recommendation was a creator-led template marketplace. Creators publish templates and earn 70% of each sale plus 10% of referral memberships through affiliate links, with view-based payouts on free templates, so supply keeps growing without Lovable paying for it. Every template and category automatically generates its own /template and /create pages, turning the library into thousands of indexed landing pages aimed at long-tail search intent. Around that sit the things that make a marketplace stick: browsing by category and style, following and favouriting creators, and certified partners who can walk beginners through onboarding.",
      "We did not stop at describing it. We built the marketplace as a working prototype on Lovable itself and demoed it live in the presentation.",
      "Three platforms carried the evidence. Webflow opened its marketplace in 2013, but it only took off once creators were paid properly, up to 80% for active designers and 60% for passive ones. The library passed 1,500 templates, active sites nearly doubled from roughly 480,000 to 930,000 in a single year, market share went from 0.25% to 0.40%, and over the following four years it reached 1.2% of the CMS market.",
      "Canva proves the SEO half. Roughly 21,000 template pages and 2,000 create pages pull an estimated 19.5 million organic visits a month. We modelled that at a deliberately conservative 5% freemium conversion rather than Canva's blended 9%, which gives about 975,000 new paid users a month, 11.7 million a year, and at $120 a year roughly $1.4 billion in annualised gross revenue potential.",
      "Framer is the closest analogue and the cleanest arithmetic. It pays creators around $6.5 million a year, and its 1,400 free public templates have drawn 21.3 million views, averaging about 16,000 views each. At that rate another 100 templates is roughly 1.6 million more views, which at a 10% remix rate is over 160,000 new projects. Applying a 2% paid conversion to the 2.1 million remixes already on record gives more than 42,500 customers acquired with no ad spend at all.",
      "We validated demand rather than assuming it. A poll of more than 100 students, the target early-user demographic, returned 80% who said they would definitely use a Lovable-native template marketplace and 93.3% positive or neutral. Two working software engineers reviewed the proposal and landed on the same point independently: tools like this run on word of mouth, and more indexed pages means more surfacing in both search results and LLM answers.",
      "Put together, we modelled the marketplace at 75 million or more new users and $450 million or more in additional annual recurring revenue, none of it bought. We costed the downside too: low-quality templates poisoning first impressions, a marketplace that acquires without retaining, and thinner short-term margins as free usage grows, each with a mitigation. The rollout ran ten to fifteen months, opening invite-only with certified designers, expanding to a controlled subset while pushing inventory past 1,000 templates and integrating the affiliate program, then a full release with creator incentives raised to 85% to 95%.",
      "We won the Toronto cohort. That took us to the worldwide session alongside the winning teams from the other TKS cities, New York and Dubai among them, where each team presented its recommendation to Lovable. We gave ours to Sophia Nabil Gustafsson.",
      "Lovable runs a template marketplace today at lovable.dev/templates. The templates on it are published by community creators rather than by Lovable alone, and the most popular ones have been remixed hundreds of times.",
    ],
    // Ranked: the overview panel shows only the first six.
    stack: [
      "Market research",
      "Growth strategy",
      "Competitive analysis",
      "SEO strategy",
      "Financial modelling",
      "Presenting",
      "User research",
      "Prototyping",
      "Data analysis",
      "Business modelling",
      "Risk analysis",
      "Slide design",
      "Script writing",
      "Team collaboration",
    ],
    links: [
      {
        label: "Standalone slide deck",
        href: "https://www.canva.com/d/DpTPb5zUQHTLUii",
      },
      {
        label: "TEDx-style presentation",
        href: "https://www.canva.com/d/nYKUyVi2NMv9AQx",
      },
      {
        label: "Marketplace prototype",
        href: "https://tksxlovablemarketplace.lovable.app",
      },
      {
        label: "Prototype demo",
        href: "https://www.youtube.com/watch?v=sxLFPbXjNV0",
      },
      {
        label: "Links to everything",
        href: "https://app.notion.com/p/TKS-GLOBAL-CHALLENGE-f58868eeabd783c98fba81ce9960c644",
      },
      {
        label: "Current Lovable template marketplace",
        href: "https://lovable.dev/templates",
      },
    ],
    images: [
      {
        src: "/work/tks-lovable-certificate.png",
        alt: "Certificate for winning team, TKS x Lovable Challenge 2025-26, awarded to Daniel Fung, Zachary Kwan, Rudra Garg, Ben Devine and Owen Devine.",
        caption: "Winning team, TKS x Lovable Challenge 2025-26",
        width: 1750,
        height: 1080,
      },
      {
        src: "/work/tks-lovable-presentation.png",
        alt: "Zoom call with the TKS cohort winners and the Lovable team during the worldwide presentations.",
        caption: "Presenting to Lovable with the winning teams from the other cohorts",
        width: 1968,
        height: 817,
      },
      {
        src: "/work/lovable-template-detail.png",
        alt: "A course landing page template on Lovable, published by an outside creator and remixed 775 times.",
        caption: "A community-built template on Lovable today, remixed 775 times",
        width: 1919,
        height: 958,
      },
      {
        src: "/work/lovable-template-marketplace.png",
        alt: "The Lovable template marketplace listing page, showing templates built by the Lovable community.",
        caption: "The Lovable template marketplace, stocked by community creators",
        width: 1919,
        height: 957,
      },
    ],
    related: ["tks-microsoft-challenge", "trash-sorting-robot"],
  },
  {
    slug: "world-cup-pool",
    title: "World Cup Pool",
    year: "June 2026",
    category: "Web app",
    status: "shipped",
    icon: Trophy,
    summary:
      "A prediction pool app for the 2026 World Cup. Built for my soccer team as a fundraiser, left open to anyone, and running 127 entries by the time it locked at the first kickoff.",
    body: [
      "You get 30 Pesodollars, buy at least 7 World Cup nations priced 1 to 7 by strength, answer a couple of tiebreakers, and collect points as your teams win. I built it for my soccer team to run as a fundraiser and left it open to anyone who wanted to start or join a pool. 127 entries were in by the time it locked at the first kickoff.",
      "The scoring is simple to say and full of edge cases. A win is 3 points, a draw is 1, a loss is 0. A knockout game decided on penalties is not a draw: the winner takes 3 and the loser still takes 1, because surviving that far is worth something. A win after extra time is just a win. Entries level on points break on the closest guess to total goals across all 104 games, shootout goals excluded, and then on the minute of the first goal in the Final. There is also a separate bonus round of trivia questions running its own prize alongside the main pool.",
      "Anything that decides a winner runs on the server. Scores are never computed in the browser: the leaderboard reads a standings cache that is recomputed server-side after each match, and submitting an entry writes the entry, its teams and its bonus answers through one Postgres function, so a half-submitted squad cannot exist. Every table has row level security, so a participant can read their own entry and the pool leaderboard and nothing else.",
      "It is Next.js on the App Router with Supabase behind it, Server Components for reads and Server Actions for writes, and the same Zod schemas validating on both sides so the client is never trusted. Budget maths is integer Pesodollars throughout, with no floats anywhere near the money. Auth is email magic links, and the whole thing is hosted on Vercel.",
      "Dark only, on a warm grey base with malachite green for anything interactive and trophy gold reserved strictly for first place and winners. Fraunces for headings against Inter for everything else, and tabular figures in the standings so the numbers stop jittering as they update.",
      "The hardest part was what I left out. Payments, paid pool creation and multi-organizer support were all deferred until the scoring engine was provably right on one real pool, which turned out to be the correct call once 127 entries were riding on it.",
    ],
    // Ranked: the overview panel shows only the first six.
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Postgres and SQL",
      "Database design",
      "Auth and access control",
      "Tailwind CSS",
      "Server Actions",
      "Zod validation",
      "UI design",
      "Product scoping",
      "Vercel",
    ],
    links: [
      {
        label: "Live site",
        href: "https://worldcuppool.ca",
      },
      {
        label: "GitHub repository",
        href: "https://github.com/ben23412341/World-Cup-Pool-App",
      },
    ],
    related: ["trash-sorting-robot", "tks-lovable-challenge"],
  },
  {
    slug: "mercura",
    title: "Mercura",
    year: "April 2026",
    category: "Startup",
    status: "founded",
    icon: Car,
    summary:
      "An AI traffic optimization company. Mercura retimes a whole grid of signals at once using data cities already collect, validated on a calibrated 24-intersection model of east Toronto against the timings running there today.",
    body: [
      "Mercura is a company I started to fix traffic with software instead of concrete. Roughly 45% of urban congestion comes from bottlenecks and poor signal timing rather than from too many cars, which makes a large part of it a software problem. Toronto runs about 2,500 signalized intersections and 87.4% of them are on preset fixed timings, most written years ago, each one deciding on its own with no idea what the next one is doing. Congestion costs the Greater Toronto and Hamilton Area around $44 billion a year and takes over 100 hours from the average driver.",
      "The pitch is one sentence: make the lights smarter without touching the lights. Cities already have what is needed. Induction loops in the road, probe and origin-destination feeds from navigation apps and fleets, transit schedules, and signal controllers that can now be reprogrammed remotely. What is missing is the brain that treats the grid as one system instead of thousands of disconnected pieces, including the disruptions that drive a large share of congestion: construction, events, weather.",
      "V1 is a genetic algorithm optimizer running on SUMO microsimulation. It tunes cycle lengths, splits, offsets and protected-left phases across every intersection jointly, scoring each candidate plan by simulating real vehicle movement rather than estimating delay from a formula. The plan the city currently runs is seeded into the search, so the optimized plan can never come out worse than what is deployed today. Minimum green times, pedestrian clearance intervals and yellow and all-red minimums are hard floors the optimizer cannot trade away, and the whole thing runs on commodity desktop hardware, which keeps re-optimization cheap enough to repeat weekly and per condition.",
      "The study network is a 24-intersection signalized grid in east Toronto, 34 signals modelled and 24 optimized, covering the Danforth, Gerrard and Dundas arterials between Pape and Coxwell. Roughly 3.5 by 3.9 km and 250 lane-km of congested, coordinated road, which is the setting where network-level timing has the most to gain.",
      "Getting the simulation honest mattered more than the optimizer did. The model is calibrated against City of Toronto turning-movement counts at PM peak, routed on the TTS 2022 origin-destination matrix, with TTC buses and streetcars modelled from GTFS and HERE Traffic API segment flows as corroboration. 93.8% of 224 counted approaches fall within GEH < 5, against the 85% threshold that is the standard acceptance criterion in traffic modelling, with zero simulation teleports.",
      "Against the timings actually deployed on that grid, V1 cut average vehicle delay by 7.4%, stopped and waiting time by 9.3%, corridor travel time by 2.7%, stops per vehicle by 2.4%, and fuel and CO2 by 2.3%, with no gridlock events in any run. Benchmarked inside the same simulation harness it lands at 73.8 seconds of average delay per vehicle against 79.7 for the field plan, 83.3 for Webster and 84.0 for a Synchro-style proxy, beating both conventional retiming methods by 11% to 12%.",
      "Earlier versions of this reported much larger gains, 22.5% off waiting time and 12.7% off travel time, from a four-intersection corridor running a far rougher model. Those numbers are in my first two write-ups and I do not stand behind them. The calibrated 24-intersection results above are the ones worth quoting, and they are smaller and real.",
      "Most of the work was not modelling. It was getting the data and getting in front of people. I cold-emailed and messaged city staff, transit agencies, data providers and traffic engineering firms to get at turning-movement counts, signal timing sheets and origin-destination data, and took meetings with anyone who would give me one. The work was reviewed by Baher Abdulhai, a professor of Civil and Mineral Engineering at the University of Toronto and an intelligent transportation systems specialist, and by Luke Piette, Director of Product-Led Growth at RunPod. Mercura also went through Concept Catalyst, Innovation Factory's program for early-stage founders.",
      "The commercial shape mattered as much as the model. Hardware-led competitors need new sensors at every intersection, which is exactly why so few cities have grid-wide coordination: the bottleneck is procurement cycles and capital cost, not ideas. Software that improves what is already in the ground deploys in months instead of years. It is also built for the city's engineer rather than around them. Mercura supplies optimized plans plus before and after validation, and the city's Professional Engineer reviews, approves and keeps full authority over anything that reaches a live signal.",
    ],
    // Ranked: the overview panel shows only the first six.
    stack: [
      "Traffic simulation (SUMO)",
      "Genetic algorithms",
      "Python",
      "Model calibration",
      "Cold outreach and emails",
      "Stakeholder meetings",
      "Geospatial data",
      "Data pipelines",
      "Startup operations",
      "Pitching",
      "Brand and web design",
      "Technical writing",
      "Business strategy",
    ],
    links: [
      {
        label: "mercura.ca",
        href: "https://mercura.ca",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/143753009/",
      },
      {
        label: "Master article",
        href: "https://medium.com/@ben23412341/mercura-master-article-3a6485a5afc1",
      },
      {
        label: "V1 write-up",
        href: "https://medium.com/@ben23412341/i-built-an-ai-that-could-fix-traffic-2e9d0f612d24",
      },
      {
        label: "V2 write-up",
        href: "https://medium.com/@ben23412341/i-built-an-ai-system-that-could-fix-traffic-1dea84186f12",
      },
      {
        label: "Slide deck",
        href: "https://drive.google.com/file/d/1074eB68QAbXGMLPylkDzObyK1ClgNXRY/view",
      },
      {
        label: "Presentation",
        href: "https://www.loom.com/share/941f93f256a5445cbd796c0bd2178630",
      },
    ],
    images: [
      {
        src: "/work/mercura-logo.png",
        alt: "The Mercura wordmark, a green outlined car beside the name Mercura on a dark background.",
        caption: "Mercura logo",
        width: 2000,
        height: 350,
      },
      {
        src: "/work/mercura-one-pager.png",
        alt: "The Mercura one pager, covering the problem, the solution, how the system works, and the V1 prototype results on a 24 intersection grid in east Toronto.",
        caption: "The one pager",
        width: 1962,
        height: 3000,
      },
    ],
    related: ["tks-lovable-challenge", "trash-sorting-robot"],
  },
  {
    slug: "coming-soon",
    title: "Coming soon",
    year: "2026",
    category: "In progress",
    status: "building",
    icon: Sparkles,
    summary:
      "There is another one in the works. It is not ready to show yet, and it will land here when it is.",
    body: [
      "There is another one in the works. It is not ready to show yet, and it will land here when it is.",
    ],
    stack: [],
    related: [],
  },
];

export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);

export const statusLabel: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  founded: "Founded",
  building: "Building",
  concept: "Concept",
};
