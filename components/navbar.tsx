import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  return (
    <NextUINavbar maxWidth="xl" position="sticky" shouldHideOnScroll>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">Rotios.io</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
          </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <i className="fab fa-github" style={{color: "gray"}}> </i>
        </Link>
        <Link isExternal aria-label="LinkedIn" href={siteConfig.links.linkedIn}>
            <i className="fab fa-linkedin" style={{color: "gray"}}></i>
        </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
      <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <i className="fab fa-github" style={{color: "gray"}}> </i>
      </Link>
      <Link isExternal aria-label="LinkedIn" href={siteConfig.links.linkedIn}>
          <i className="fab fa-linkedin" style={{color: "gray"}}></i>
      </Link>
      <ThemeSwitch />
      </NavbarContent>
    </NextUINavbar>
  );
};
