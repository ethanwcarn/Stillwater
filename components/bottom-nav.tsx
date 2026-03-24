"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, CalendarPlus, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "therapists", label: "Therapists", icon: Search, path: "/therapists" },
  { id: "session", label: "Session", icon: CalendarPlus, path: "/session" },
  { id: "feed", label: "Feed", icon: MessageSquare, path: "/feed" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs transition-all duration-200",
                isActive
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={cn(
                  "transition-all duration-200",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>

              {isActive && (
                <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer for mobile */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}