export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Jose Rivas-Garcia",
  description: "A personal development website.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Blog",
      href: "/blog",
    },
  ],
  links: {
    github: "https://github.com/rotios",
    linkedIn: "https://www.linkedin.com/in/rotios/",
    docs: "https://www.heroui.com",
    resume: "https://rotios.dev/files/RivasResume.pdf"
  },
};
