"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard, FileText, Upload, Bookmark, User,
  Users, Flag, FolderTree, BookOpen, GraduationCap,FileCog,
  ClipboardList, X, TrendingUp, Compass, type LucideIcon,
} from "lucide-react";

/* ─── types ──────────────────────────────────────────────────── */
type LinkItem    = { href: string; label: string; icon: LucideIcon };
type DividerItem = { type: "divider"; label: string };
type NavItem     = LinkItem | DividerItem;

/* ─── nav data ───────────────────────────────────────────────── */
const studentLinks: NavItem[] = [
  { href: "/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
  { href: "/papers",     label: "Browse Papers", icon: FileText       },
  { href: "/explore",    label: "Explore",       icon: Compass        },
  { href: "/trending",   label: "Trending",      icon: TrendingUp     },
  { type: "divider",     label: "My Content"                          },
  { href: "/upload",     label: "Upload Paper",  icon: Upload         },
  { href: "/my-uploads", label: "My Uploads",    icon: ClipboardList  },
  { href: "/bookmarks",  label: "Bookmarks",     icon: Bookmark       },
  { type: "divider",     label: "Account"                             },
  { href: "/profile",    label: "Profile",       icon: User           },
];

const adminLinks: NavItem[] = [
  { href: "/admin",              label: "Dashboard",        icon: LayoutDashboard },
  { href: "/admin/papers",       label: "Paper Moderation", icon: FileText        },
  { href: "/admin/manage-papers", label: "Manage Papers",    icon: FileCog         }, // ← new
  { href: "/admin/users",        label: "Users",            icon: Users           },
  { href: "/admin/reports",      label: "Reports",          icon: Flag            },
  { href: "/admin/departments",  label: "Departments",      icon: FolderTree      },
  { href: "/admin/programs",     label: "Programs",         icon: GraduationCap   },
  { href: "/admin/courses",      label: "Courses",          icon: BookOpen        },
  { href: "/admin/logs",         label: "Moderation Logs",  icon: ClipboardList   },
  { type: "divider",             label: "Student Access"                          },
  { href: "/papers",             label: "Browse Papers",    icon: FileText        },
  { href: "/explore",            label: "Explore",          icon: Compass         },
  { href: "/upload",             label: "Upload Paper",     icon: Upload          },
];

/* ─── sidebar content ─────────────────────────────────────────── */
function SidebarContent() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { setSidebarOpen } = useUIStore();
  const links = user?.role === "ADMIN" ? adminLinks : studentLinks;

  return (
    <div className="flex h-full flex-col bg-background">

      {/* Mobile header */}
      <div className="flex items-center justify-between px-4 py-4 md:hidden border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-xl",
            "border border-border bg-card shadow-sm",
          )}>
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
            <GraduationCap className="relative h-4 w-4 text-primary" />
          </div>
          <span className="text-[14px] font-semibold text-foreground">
            Study<span className="text-muted-foreground">House</span>
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={() => setSidebarOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
        {links.map((link, i) => {

          /* Divider */
          if ("type" in link && link.type === "divider") {
            return (
              <div key={i} className="my-2 px-2">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">
                    {link.label}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </div>
            );
          }

          /* Link */
          const l = link as LinkItem;
          const isActive = pathname === l.href;

          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              {/* Active background */}
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-muted"
                  transition={{ type: "spring", damping: 26, stiffness: 300 }}
                />
              )}

              {/* Icon */}
              <span className={cn(
                "relative z-10 flex h-6 w-6 items-center justify-center rounded-lg transition-colors duration-150",
                isActive ? "text-primary" : "text-muted-foreground",
              )}>
                <l.icon className="h-3.5 w-3.5" />
              </span>

              {/* Label */}
              <span className="relative z-10">{l.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom user badge (desktop only) */}
      {user && (
        <div className="hidden md:block mx-3 mb-3 p-3 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-foreground truncate leading-none mb-0.5">
                {user.name}
              </p>
              <p className="text-[10px] text-muted-foreground capitalize leading-none">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── sidebar shell ──────────────────────────────────────────── */
export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-background min-h-[calc(100vh-4rem)]">
        <SidebarContent />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-60 p-0 bg-background border-r border-border [&>button]:hidden"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
