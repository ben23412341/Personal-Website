/**
 * Single place to edit the personal details the site renders.
 * Change these values instead of hunting through components.
 */
/** One address, shared by the Contact button and the mail icon. */
const EMAIL = "ben23412341@gmail.com";

export const siteConfig = {
  name: "Ben Devine",
  location: "Toronto, Canada",
  role: "Developer & Designer",
  /**
   * Canonical origin, no trailing slash. Every absolute URL the site hands a
   * crawler is built from this: the sitemap, robots.txt, the structured data
   * and `metadataBase`. Pick one host and stay on it — www and the bare
   * domain are two sites to Google, and splitting between them splits the
   * credit for every link.
   */
  url: "https://www.bendevine.ca",
  /**
   * The home page's <title>. Search results are the one place the site has to
   * say what it is to someone who has never seen it, and there are several
   * other Ben Devines to be told apart from.
   */
  title: "Ben Devine | Student Builder & Developer in Toronto",
  description:
    "Personal site of Ben Devine: projects, work and experience.",

  /**
   * Drives the live age counter in the hero.
   * Format: YYYY-MM-DDTHH:mm:ss (local time).
   */
  birthDate: "2010-01-18T09:00:00",

  nav: [
    { label: "About", href: "/#about" },
    { label: "Work", href: "/#work" },
    { label: "Experience", href: "/#experience" },
    { label: "Achievements", href: "/#achievements" },
    // There is no #contact section; the button opens a mail draft instead.
    { label: "Contact", href: `mailto:${EMAIL}` },
  ],

  socials: {
    github: "https://github.com/ben23412341",
    linkedin: "https://www.linkedin.com/in/ben-devine-4a2a5b382/",
    medium: "https://medium.com/@ben23412341",
    youtube: "https://www.youtube.com/@Ben.Devine",
    email: `mailto:${EMAIL}`,
  },


  /** TODO: placeholder copy — rewrite in your own words. */
  about: {
    index: "01",
    heading: "I build things.",
    body: [
      // Opens in the third person on purpose: this is the one sentence on the
      // site that says, in plain words a search engine can match, who Ben
      // Devine is and where he is. The rest of the copy stays in his voice.
      "Ben Devine is a grade 11 student based in Toronto, heavily focused on technology and building things that are useful in the World.",
      "Most of what I make starts as something that I wish existed or already had in my life. The projects below are where some of those ended up.",
    ],
    meta: [
      { label: "Based in", value: "Toronto, Canada" },
      { label: "Focus", value: "Technology, Business, AI" },
      { label: "Currently", value: "Open to new work" },
    ],
  },

} as const;

export type SiteConfig = typeof siteConfig;
