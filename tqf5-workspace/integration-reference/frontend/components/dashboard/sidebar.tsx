import {
  BookOpen,
  HelpCircle,
  History,
  Layers3,
  LayoutDashboard,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sun,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
  icon: LucideIcon
  label: string
  id: string
  badge?: string
}

const menuItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: BookOpen, label: "Course Specs", badge: "TQF3", id: "course-specs" },
  { icon: Layers3, label: "Artifacts", id: "artifacts" },
  { icon: History, label: "Patch History", id: "patch-history" },
  { icon: Users, label: "Faculty List", id: "team" },
]

const generalItems: NavItem[] = [
  { icon: Settings, label: "Settings", id: "settings" },
  { icon: HelpCircle, label: "Documentation", id: "help" },
  { icon: LogOut, label: "Logout", id: "logout" },
]

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onItemClick?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({
  activeTab,
  setActiveTab,
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const { theme, setTheme } = useTheme()

  const handleItemClick = (id: string) => {
    setActiveTab(id)
    onItemClick?.()
  }

  const renderItems = (items: NavItem[]) =>
    items.map((item) => {
      const isActive = activeTab === item.id

      if (isCollapsed) {
        return (
          <Tooltip key={item.id} delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "group relative flex h-10 w-10 mx-auto items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-sidebar-primary focus-visible:outline-offset-2",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary shadow-xs ring-1 ring-sidebar-primary/20"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className={cn(
                    "h-[19px] w-[19px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-sidebar-primary" : "text-sidebar-foreground/65 group-hover:text-sidebar-primary",
                  )}
                />
                {item.badge && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sidebar-primary ring-2 ring-sidebar" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10} className="flex items-center gap-2 font-medium">
              <span>{item.label}</span>
              {item.badge && (
                <span className="rounded bg-sidebar-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-sidebar-primary">
                  {item.badge}
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        )
      }

      return (
        <button
          key={item.id}
          type="button"
          aria-current={isActive ? "page" : undefined}
          onClick={() => handleItemClick(item.id)}
          className={cn(
            "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] font-bold leading-5 tracking-normal transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-sidebar-primary focus-visible:outline-offset-2",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:left-0 before:top-2 before:h-6 before:w-0.5 before:rounded-full before:bg-sidebar-primary"
              : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
          )}
        >
          <item.icon
            aria-hidden="true"
            className={cn(
              "h-[17px] w-[17px] shrink-0 transition-colors duration-200",
              isActive
                ? "text-sidebar-primary"
                : "text-sidebar-foreground/65 group-hover:text-sidebar-primary",
            )}
          />
          <span className="truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto rounded-md bg-sidebar-primary/15 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.08em] text-sidebar-primary">
              {item.badge}
            </span>
          )}
        </button>
      )
    })

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-sidebar py-5 font-sidebar text-sidebar-foreground transition-all duration-300",
        isCollapsed ? "px-2" : "px-3",
      )}
    >
      {/* Account / Header Area */}
      <div className={cn("mb-6 transition-all duration-300", isCollapsed ? "px-0" : "px-2")}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/45">
              Account
            </p>
          )}
          {onToggleCollapse && (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg text-sidebar-foreground/50 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sidebar-primary",
                    isCollapsed && "mx-auto mb-2",
                  )}
                >
                  {isCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {isCollapsed ? (
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleItemClick("settings")}
                aria-label="Open account settings"
                className="group mt-1 flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-sidebar-accent/35 hover:bg-sidebar-accent/70 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-sidebar-primary"
              >
                <Avatar className="h-7 w-7 ring-2 ring-sidebar-primary/20 transition-transform duration-200 group-hover:scale-105">
                  <AvatarImage src="/placeholder-user.jpg" alt="" />
                  <AvatarFallback className="bg-sidebar-primary text-[10px] font-black text-sidebar-primary-foreground">
                    JS
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10} className="flex flex-col gap-0.5">
              <span className="font-bold text-xs">Jessin Sam</span>
              <span className="text-[10px] text-muted-foreground">jessin@gmail.com</span>
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={() => handleItemClick("settings")}
            aria-label="Open account settings"
            className="group mt-2.5 flex w-full items-center gap-2.5 rounded-lg bg-sidebar-accent/35 px-2.5 py-2.5 text-left transition-colors hover:bg-sidebar-accent/60 focus-visible:outline-2 focus-visible:outline-sidebar-primary focus-visible:outline-offset-2"
          >
            <Avatar className="h-8 w-8 ring-2 ring-sidebar-primary/20 transition-transform duration-200 group-hover:-rotate-3">
              <AvatarImage src="/placeholder-user.jpg" alt="" />
              <AvatarFallback className="bg-sidebar-primary text-[10px] font-black text-sidebar-primary-foreground">
                JS
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-bold tracking-tight text-sidebar-foreground">
                Jessin Sam
              </span>
              <span className="mt-0.5 block truncate text-[10px] text-sidebar-foreground/50">
                jessin@gmail.com
              </span>
            </span>
          </button>
        )}
      </div>

      {/* Primary nav */}
      <div className="space-y-1">
        {!isCollapsed && (
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/40">
            Navigate
          </p>
        )}
        <nav aria-label="Main navigation" className={cn("space-y-1.5", isCollapsed && "flex flex-col items-center")}>
          {renderItems(menuItems)}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="mt-auto pt-6">
        <div className={cn("mb-5 h-px bg-sidebar-border/80", isCollapsed && "mx-1")} />

        {/* Theme Toggle (Mobile or Collapsed) */}
        {!isCollapsed && (
          <div className="mb-4 px-1 lg:hidden">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-sidebar-foreground/40">
              Appearance
            </p>
            <div className="flex items-center gap-1 rounded-full bg-sidebar-accent/40 p-1">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                aria-label="Dark mode"
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer",
                  theme === "dark"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow"
                    : "text-sidebar-foreground/50 hover:text-sidebar-foreground",
                )}
              >
                <Moon className="h-3 w-3" />
                Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                aria-label="Light mode"
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer",
                  theme === "light"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow"
                    : "text-sidebar-foreground/50 hover:text-sidebar-foreground",
                )}
              >
                <Sun className="h-3 w-3" />
                Light
              </button>
            </div>
          </div>
        )}

        {!isCollapsed && (
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/40">
            Manage
          </p>
        )}
        <nav aria-label="Account navigation" className={cn("space-y-1.5", isCollapsed && "flex flex-col items-center")}>
          {renderItems(generalItems)}
        </nav>
      </div>
    </aside>
  )
}
