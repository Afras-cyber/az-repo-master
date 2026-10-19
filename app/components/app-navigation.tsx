"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Overview", href: "/", icon: "overview" },
  { label: "Code", href: "/code", icon: "code" },
  { label: "Ask", href: "/ask", icon: "ask" },
  { label: "Insights", href: "/insights", icon: "insights" },
] as const;

function MenuIcon({ name }: { name: (typeof menuItems)[number]["icon"] }) {
  const shared = {
    "aria-hidden": true as const,
    className: "size-5 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "overview":
      return (
        <svg {...shared}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "code":
      return (
        <svg {...shared}>
          <path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5M14 4l-4 16" />
        </svg>
      );
    case "ask":
      return (
        <svg {...shared}>
          <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-7.5A7.5 7.5 0 1 1 20 11.5Z" />
          <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.2-1.7 2.7M12 16.5h.01" />
        </svg>
      );
    case "insights":
      return (
        <svg {...shared}>
          <path d="M4 19.5h16M6.5 16V11M11.5 16V5M16.5 16v-8" />
          <path d="m5 8 5-4 5 3 4-3" />
        </svg>
      );
  }
}

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label={mobile ? "Main navigation" : "Sidebar navigation"}>
      <ul
        className={
          mobile
            ? "flex items-stretch justify-around"
            : "flex flex-col gap-1"
        }
      >
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <li key={item.href} className={mobile ? "flex-1" : undefined}>
              <Link
                aria-current={active ? "page" : undefined}
                href={item.href}
                className={
                  mobile
                    ? `flex min-h-mobile-tabbar flex-col items-center justify-center gap-1 text-nav-label-mobile font-medium transition ${
                        active
                            ? "text-accent"
                            : "text-text-muted hover:text-text"
                      }`
                      : `flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition ${
                        active
                            ? "bg-sidebar-active text-sidebar-text-active"
                            : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
                      }`
                }
              >
                <MenuIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function AppNavigation() {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-sidebar shrink-0 flex-col bg-sidebar px-5 py-6 desktop:flex">
        <Link href="/" className="mb-10 flex items-center gap-3 px-2">
          <span className="flex size-9 items-center justify-center rounded-control bg-accent text-sm font-bold text-accent-on">
            R
          </span>
          <span className="text-heading2 font-bold tracking-tight text-sidebar-text-active">
            Repo Master
          </span>
        </Link>
        <p className="mb-3 px-3 text-nav-label-mobile font-bold uppercase tracking-[0.14em] text-sidebar-text">
          Workspace
        </p>
        <NavigationLinks />
        <div className="mt-auto rounded-card bg-sidebar-hover p-4">
          <p className="text-small font-bold text-sidebar-text-active">
            Your workspace
          </p>
          <p className="mt-1 text-caption leading-body text-sidebar-text">
            Navigate your project from one place.
          </p>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur desktop:hidden">
        <NavigationLinks mobile />
      </div>
    </>
  );
}
