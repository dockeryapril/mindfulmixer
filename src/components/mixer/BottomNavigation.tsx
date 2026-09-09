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
  const compactLandscape = path === "/";

  return (
    <nav
      aria-label="Main"
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-panel-edge bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur",
        compactLandscape &&
          "max-lg:landscape:inset-x-auto max-lg:landscape:right-[max(0.5rem,env(safe-area-inset-right))] max-lg:landscape:bottom-[max(0.5rem,env(safe-area-inset-bottom))] max-lg:landscape:w-36 max-lg:landscape:rounded-2xl max-lg:landscape:border max-lg:landscape:pb-0",
      )}
    >
      <ul
        className={cn(
          "mx-auto flex max-w-md items-end justify-around px-4 py-2",
          compactLandscape && "max-lg:landscape:px-1 max-lg:landscape:py-1",
        )}
      >
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
                  compactLandscape && "max-lg:landscape:gap-0 max-lg:landscape:py-0",
                  current ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full border border-panel-edge transition-all",
                    primary ? "h-12 w-12 -mt-4" : "h-9 w-9",
                    compactLandscape &&
                      "max-lg:landscape:mt-0 max-lg:landscape:h-9 max-lg:landscape:w-9",
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
                <span className={cn(compactLandscape && "max-lg:landscape:sr-only")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
