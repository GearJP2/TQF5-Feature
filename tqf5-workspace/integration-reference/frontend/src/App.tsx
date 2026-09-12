import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { mockCourses } from "@/lib/mockData"
import { cn } from "@/lib/utils"

// Pages folder imports
import { Dashboard } from "@/pages/Dashboard"
import { CourseSpecs } from "@/pages/CourseSpecs"
import { Artifacts } from "@/pages/Artifacts"
import { PatchHistory } from "@/pages/PatchHistory"
import { Calendar } from "@/pages/Calendar"
import { Analytics } from "@/pages/Analytics"
import { Team } from "@/pages/Team"
import { Settings } from "@/pages/Settings"
import { Help } from "@/pages/Help"

function MainLayout() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("cstu-sidebar-collapsed") === "true"
    } catch {
      return false
    }
  })

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem("cstu-sidebar-collapsed", String(next))
      } catch {}
      return next
    })
  }
  
  // Selected course context states
  const [selectedCourseId, setSelectedCourseId] = useState<string>("CS100")
  const [selectedSemester, setSelectedSemester] = useState<string>("1/2568")
  const [selectedSection, setSelectedSection] = useState<string>("010001")
  const selectedCourse = mockCourses.find((course) => course.course_id === selectedCourseId)
  const courseContext = activeTab === "course-specs" && selectedCourse
    ? [
        selectedCourse.course_code_en,
        `Semester ${selectedSemester}`,
        selectedSection ? `Section ${selectedSection}` : "Choose a section",
      ].join(" · ")
    : undefined

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            courseId={selectedCourseId}
            semester={selectedSemester}
            section={selectedSection}
            onOpenCourseSpecs={() => setActiveTab("course-specs")}
          />
        )
      case "course-specs":
        return (
          <CourseSpecs 
            defaultCourseId={selectedCourseId}
            defaultSemester={selectedSemester}
            defaultSection={selectedSection}
            setActiveTab={setActiveTab}
            setSelectedCourseId={setSelectedCourseId}
            setSelectedSemester={setSelectedSemester}
            setSelectedSection={setSelectedSection}
          />
        )
      case "artifacts":
        return (
          <Artifacts
            courseId={selectedCourseId}
            semester={selectedSemester}
            section={selectedSection}
            setActiveTab={setActiveTab}
            setSelectedCourseId={setSelectedCourseId}
            setSelectedSemester={setSelectedSemester}
            setSelectedSection={setSelectedSection}
          />
        )
      case "patch-history":
        return (
          <PatchHistory
            courseId={selectedCourseId}
            semester={selectedSemester}
            section={selectedSection}
            setActiveTab={setActiveTab}
          />
        )
      case "calendar":
        return <Calendar activeTab={activeTab} setActiveTab={setActiveTab} />
      case "analytics":
        return <Analytics activeTab={activeTab} setActiveTab={setActiveTab} />
      case "team":
        return <Team activeTab={activeTab} setActiveTab={setActiveTab} />
      case "settings":
        return <Settings activeTab={activeTab} setActiveTab={setActiveTab} />
      case "help":
        return <Help activeTab={activeTab} setActiveTab={setActiveTab} />
      case "logout":
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
            <div className="glass-card max-w-md p-8 rounded-2xl border border-border bg-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Logged Out</h2>
              <p className="text-muted-foreground text-sm mb-6">
                You have successfully signed out of CSTU Portal. Click below to reload and access your workspace again.
              </p>
              <Button onClick={() => setActiveTab("dashboard")} className="w-full cursor-pointer bg-primary text-primary-foreground">
                Log In Again
              </Button>
            </div>
          </div>
        )
      default:
        return <div>Tab not found</div>
    }
  }

  const pageTitle: Record<string, { title: string; description: string }> = {
    dashboard: { title: "Dashboard", description: "Overview of your courses and TQF documents" },
    "course-specs": { title: "Course Specifications", description: "Start with general course information" },
    artifacts: { title: "Artifacts", description: "Shared curriculum templates and course artifacts" },
    "patch-history": { title: "Patch History", description: "Template versions and audit events" },
    calendar: { title: "Calendar", description: "Academic calendar and schedule" },
    analytics: { title: "Analytics", description: "Course analytics and performance" },
    team: { title: "Faculty List", description: "Browse instructors in your department" },
    settings: { title: "Settings", description: "Configure your account preferences" },
    help: { title: "Documentation", description: "Guides for authoring, AI context, saving, and export" },
    logout: { title: "Logout", description: "" },
  }
  const { title, description } = pageTitle[activeTab] ?? { title: activeTab, description: "" }

  return (
    <div className="flex h-screen bg-background w-full overflow-hidden">
      {/* Sidebar - Desktop (fixed) */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen border-r border-border bg-card z-50 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-[68px]" : "w-60",
        )}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Right column: sticky header + scrollable content */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col min-h-0 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-60",
        )}
      >
        {/* Sticky Header */}
        <Header
          title={title}
          description={description}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          courseContext={courseContext}
        />

        {/* Scrollable Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-5 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="cstu-theme" attribute="class" enableSystem={false}>
      <MainLayout />
      <Toaster />
    </ThemeProvider>
  )
}

export default App
