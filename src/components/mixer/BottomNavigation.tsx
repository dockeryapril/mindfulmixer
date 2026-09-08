import { Link, useRouterState } from "@tanstack/react-router";
import { ListMusic, Settings as SettingsIcon, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/mixes", label: "My Mixes", icon: ListMusic },
  { to: "/", label: "Mixer", icon: SlidersHorizontal, primary: true },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function BottomNavigation() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-panel-edge bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex max-w-md items-end justify-around px-4 py-2">
        {ITEMS.map(({ to, label, icon: Icon, ...rest }) => {
          const current = path === to;
          const primary = "primary" in rest && rest.primary;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium transition-colors",
                  current ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full border border-panel-edge transition-all",
                    primary ? "h-12 w-12 -mt-4" : "h-9 w-9",
                    current && primary
                      ? "bg-primary text-primary-foreground accent-glow"
                      : primary
                        ? "knob"
                        : current
                          ? "bg-primary/12"
                          : "bg-transparent border-transparent",
                  )}
                >
                  <Icon size={primary ? 22 : 18} strokeWidth={1.7} aria-hidden="true" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
