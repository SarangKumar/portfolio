"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Monogram } from "@/components/site/monogram";
import { navItems, siteName } from "@/lib/site";
import { cn } from "@/lib/utils";

type Project = { slug: string; title: string; summary: string };

type SiteHeaderProps = {
  projects: readonly Project[];
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ projects }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-background/70 supports-[backdrop-filter]:bg-background/50 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="app-container flex h-14 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5 rounded-md">
          <Monogram />
          <span className="text-sm font-semibold tracking-tight">
            {siteName}
          </span>
        </Link>

        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            <NavigationMenuItem value="projects">
              <NavigationMenuTrigger
                className={cn(
                  "hover:bg-accent focus-visible:ring-ring inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium transition-colors",
                  isActive(pathname, "/projects") && "text-primary",
                )}
              >
                Projects
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-80 p-2">
                <ul className="flex flex-col gap-3">
                  {projects.map((project) => (
                    <li key={project.slug}>
                      <NavigationMenuLink
                        href={`/projects/${project.slug}`}
                        className="flex-col items-start gap-0.5 py-2"
                      >
                        <span className="text-sm font-medium">
                          {project.title}
                        </span>
                        <span className="text-muted-foreground line-clamp-2 text-xs">
                          {project.summary}
                        </span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li>
                    <NavigationMenuLink
                      href="/projects"
                      className="text-primary"
                    >
                      All projects →
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {navItems.map((item) => (
              <NavigationMenuItem key={item.href} value={item.href}>
                <NavigationMenuLink
                  href={item.href}
                  active={isActive(pathname, item.href)}
                  className={cn(
                    "transition-colors",
                    isActive(pathname, item.href) && "text-primary",
                  )}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <Sheet>
          <SheetTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1 px-2" aria-label="Mobile">
              <Link
                href="/projects"
                className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
              >
                Projects
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "hover:bg-accent rounded-md px-3 py-2 text-sm font-medium",
                    isActive(pathname, item.href) && "text-primary",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
