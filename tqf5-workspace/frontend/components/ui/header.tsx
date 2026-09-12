import { MobileNav } from "@/components/dashboard/mobile-nav"

interface HeaderProps {
  title: string
  description?: string
  activeTab: string
  setActiveTab: (tab: string) => void
  courseContext?: string
}

export function Header({
  title,
  description: _description,
  activeTab,
  setActiveTab,
  courseContext: _courseContext,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="relative flex h-[72px] items-center justify-between gap-4 px-5 md:px-8">
        {/* Left: mobile menu, logo, and current page */}
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            aria-label="Go to dashboard"
            className="group flex shrink-0 items-center gap-3 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xs font-black text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-200 group-hover:-rotate-6">
              C
            </span>
            <span className="hidden text-[15px] font-bold tracking-tight text-foreground sm:inline">CSTU Portal</span>
          </button>

          <div className="hidden min-w-0 border-l border-border pl-4 md:block">
            <h1 className="truncate text-[15px] font-bold leading-none text-foreground">{title}</h1>
          </div>
        </div>
      </div>
    </header>
  )
}
