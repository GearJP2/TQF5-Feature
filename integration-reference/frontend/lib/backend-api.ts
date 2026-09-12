export const backendApiUrl = (import.meta.env.VITE_BACKEND_API_URL ?? "http://localhost:8000").replace(/\/$/, "")

type QueryValue = string | number | boolean | null | undefined

export interface ProgramTemplate {
  template_id: number
  program_id?: string | null
  curriculum_id?: string | null
  pathway_id?: string | null
  template_type: string
  version: string
  content_json: Record<string, unknown>
  active: boolean
  created_at: string
  updated_at: string
}

export type ProgramTemplateCreate = Omit<ProgramTemplate, "template_id" | "created_at" | "updated_at">
export type ProgramTemplateUpdate = Partial<ProgramTemplateCreate>

export interface CourseGeneralInfoTemplate {
  template_id: number
  course_id?: string | null
  program_id?: string | null
  curriculum_id?: string | null
  pathway_id?: string | null
  course_code?: string | null
  course_name_th?: string | null
  course_name_en?: string | null
  credits?: number | null
  lecture_hours?: number | null
  lab_hours?: number | null
  self_study_hours?: number | null
  prerequisite?: string | null
  corequisite?: string | null
  description_th?: string | null
  description_en?: string | null
  default_instructors_json: Record<string, unknown>
  default_schedule_json: Record<string, unknown>
  active: boolean
  created_at: string
  updated_at: string
}

export type CourseGeneralInfoTemplateCreate = Omit<CourseGeneralInfoTemplate, "template_id" | "created_at" | "updated_at">
export type CourseGeneralInfoTemplateUpdate = Partial<CourseGeneralInfoTemplateCreate>

export interface Tqf3Artifact {
  artifact_id: number
  section_id?: number | null
  course_id?: string | null
  pathway_id?: string | null
  course_template_id?: number | null
  program_template_id?: number | null
  status: "draft" | "ready" | "approved"
  version: number
  artifact_json: Record<string, unknown>
  reference_snapshot_json: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type Tqf3ArtifactCreate = Omit<Tqf3Artifact, "artifact_id" | "section_id" | "course_id" | "version" | "created_at" | "updated_at"> & {
  section_id: number
  course_id: string
}
export type Tqf3ArtifactUpdate = Partial<Tqf3ArtifactCreate>

export interface CurriculumPlo {
  plo_id: string
  curriculum_id: string
  plo_code: string
  domain?: string | null
  sequence?: number | null
  statement_th?: string | null
  short_label_th?: string | null
  notes?: string | null
  active: boolean
  display_order?: number | null
  required?: boolean | null
  source_generated_at?: string | null
}

export interface ProgrammeReference {
  program?: Record<string, unknown> | null
  curriculum?: Record<string, unknown> | null
  pathway?: Record<string, unknown> | null
  plos: CurriculumPlo[]
  summary?: Record<string, unknown> | null
}

export interface CoursePloMapping { plo_id: string; plo_code: string; level: "I" | "M" | "F" }

export interface CoursePloMappingReference {
  source: string
  course_id: string
  curriculum_id: string
  pathway_id: string
  mappings: CoursePloMapping[]
}

export interface CatalogCourse {
  course_id: string
  course_code: string
  course_code_th?: string | null
  title_th?: string | null
  title_en?: string | null
  credits_total?: number | null
  curriculum_id?: string | null
  pathway_id?: string | null
}

export interface CourseSection {
  section_id: number
  course_id: string
  section_number: string
  semester: number
  academic_year: number
}

export interface CourseContextCreate {
  course_id: string
  course_code: string
  course_code_th?: string
  course_name_th?: string
  course_name_en: string
  credits?: number
  lecture_hours?: number
  lab_hours?: number
  section_number: string
  semester: number
  academic_year: number
  source: "catalogue" | "manual"
}

export interface MapperAgentSuggestion {
  clo_id: number
  clo_code: string
  plo_id: string
  plo_code: string
  reason: string
}

export interface MapperAgentResponse {
  message: string
  mappings: MapperAgentSuggestion[]
  plo_source: "pathway_plos" | "program_plos"
  persisted: boolean
  ignored_hallucinations: number
}

export interface CloQualityInput {
  code: string
  description: string
  knowledge?: boolean
  skill?: boolean
  ethics?: boolean
  character?: boolean
  mapped_plo_ids?: string[]
  mapping_level?: "I" | "M" | "F"
}

export interface CloQualityItem {
  cloCode: string
  status: "ok" | "needs_revision"
  issues: string[]
  suggestedRewrite: string
  recommendedTeachingMethods: string[]
  recommendedAssessmentMethods: string[]
  recommendedEvidence: string[]
  cloType: string
  mappingLevel?: "I" | "M" | "F" | null
  reason: string
}

export interface CloQualityResponse {
  items: CloQualityItem[]
  reference_sources: string[]
  warnings: string[]
  persisted: boolean
  ignored_hallucinations: number
}

export function listCourseSections(courseId: string) {
  return apiGet<CourseSection[]>(`/api/v1/courses/${encodeURIComponent(courseId)}/sections`)
}

export function ensureCourseContext(payload: CourseContextCreate) {
  return apiJson<CourseSection>("/api/v1/course-contexts", "POST", payload)
}

export function suggestCloPloMappings(courseId: string, pathwayId?: string) {
  return apiJson<MapperAgentResponse>("/api/v1/agent/mapper", "POST", undefined, {
    course_id: courseId,
    pathway_id: pathwayId,
  })
}

export function checkCloQuality(payload: {
  course_id: string
  section_id?: number
  pathway_id?: string
  clos: CloQualityInput[]
  context?: Record<string, unknown>
}) {
  return apiJson<CloQualityResponse>("/api/v1/agent/clo-quality-check", "POST", payload)
}

export function listProgramTemplates(filters: {
  program_id?: string
  curriculum_id?: string
  pathway_id?: string
  template_type?: string
  active?: boolean
} = {}) {
  return apiGet<ProgramTemplate[]>("/api/v1/tqf3-assets/program-templates", filters)
}

export function createProgramTemplate(payload: ProgramTemplateCreate) {
  return apiJson<ProgramTemplate>("/api/v1/tqf3-assets/program-templates", "POST", payload)
}

export function updateProgramTemplate(templateId: number, payload: ProgramTemplateUpdate) {
  return apiJson<ProgramTemplate>(`/api/v1/tqf3-assets/program-templates/${templateId}`, "PATCH", payload)
}

export function listCourseGeneralInfoTemplates(filters: {
  course_id?: string
  program_id?: string
  curriculum_id?: string
  pathway_id?: string
  active?: boolean
} = {}) {
  return apiGet<CourseGeneralInfoTemplate[]>("/api/v1/tqf3-assets/course-general-info-templates", filters)
}

export function createCourseGeneralInfoTemplate(payload: CourseGeneralInfoTemplateCreate) {
  return apiJson<CourseGeneralInfoTemplate>("/api/v1/tqf3-assets/course-general-info-templates", "POST", payload)
}

export function updateCourseGeneralInfoTemplate(templateId: number, payload: CourseGeneralInfoTemplateUpdate) {
  return apiJson<CourseGeneralInfoTemplate>(`/api/v1/tqf3-assets/course-general-info-templates/${templateId}`, "PATCH", payload)
}

export function listTqf3Artifacts(filters: {
  section_id?: number
  course_id?: string
  pathway_id?: string
  status?: string
} = {}) {
  return apiGet<Tqf3Artifact[]>("/api/v1/tqf3-assets/artifacts", filters)
}

export function createTqf3Artifact(payload: Tqf3ArtifactCreate) {
  return apiJson<Tqf3Artifact>("/api/v1/tqf3-assets/artifacts", "POST", payload)
}

export function updateTqf3Artifact(artifactId: number, payload: Tqf3ArtifactUpdate) {
  return apiJson<Tqf3Artifact>(`/api/v1/tqf3-assets/artifacts/${artifactId}`, "PATCH", payload)
}

export function getProgrammeReference(pathwayId: string) {
  return apiGet<ProgrammeReference>(`/api/v1/curriculum-reference/programme/${encodeURIComponent(pathwayId)}`)
}

export function listPathwayPlos(pathwayId: string) {
  return apiGet<CurriculumPlo[]>(`/api/v1/curriculum-reference/pathways/${encodeURIComponent(pathwayId)}/plos`)
}

export function getCoursePloMappings(courseCode: string) {
  return apiGet<CoursePloMappingReference>(`/api/v1/curriculum-reference/courses/${encodeURIComponent(courseCode)}/plo-mappings`)
}

export function listCatalogCourses() {
  return apiGet<CatalogCourse[]>("/api/v1/curriculum-reference/courses")
}

export function downloadTqf3Docx(sectionId: number) {
  return downloadFile(`/api/v1/export/tqf3/${sectionId}/docx`)
}

export function downloadTqf3Pdf(sectionId: number) {
  return downloadFile(`/api/v1/export/tqf3/${sectionId}/pdf`)
}

export async function renderTqf3PreviewDocx(payload: {
  section_id: number
  artifact_json: Record<string, unknown>
  reference_snapshot_json: Record<string, unknown>
}) {
  const response = await fetch(buildUrl("/api/v1/export/tqf3/preview/docx"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null) as { detail?: unknown } | null
    throw new Error(extractErrorMessage(error) ?? `Live preview failed with status ${response.status}.`)
  }
  return response.blob()
}

async function apiGet<T>(path: string, query: Record<string, QueryValue> = {}): Promise<T> {
  return requestJson<T>(buildUrl(path, query), { method: "GET" })
}

async function apiJson<T>(
  path: string,
  method: "POST" | "PATCH",
  payload?: unknown,
  query: Record<string, QueryValue> = {},
): Promise<T> {
  return requestJson<T>(buildUrl(path, query), {
    method,
    headers: payload === undefined ? undefined : { "Content-Type": "application/json" },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  })
}

async function requestJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const payload = await response.json().catch(() => null) as { detail?: unknown } | T | null

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload) ?? `Backend request failed with status ${response.status}.`)
  }
  if (payload === null) throw new Error("Backend returned an empty response.")

  return payload as T
}

async function downloadFile(path: string): Promise<Blob> {
  const response = await fetch(buildUrl(path), { method: "GET" })
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { detail?: unknown } | null
    throw new Error(extractErrorMessage(payload) ?? `File download failed with status ${response.status}.`)
  }
  return response.blob()
}

function buildUrl(path: string, query: Record<string, QueryValue> = {}): string {
  const url = new URL(path, backendApiUrl || window.location.origin)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object" || !("detail" in payload)) return null

  const detail = (payload as { detail?: unknown }).detail
  if (!detail) return null
  if (typeof detail === "string") return detail
  if (typeof detail === "object" && detail && "message" in detail) {
    const message = (detail as { message?: unknown }).message
    return typeof message === "string" ? message : null
  }
  return null
}
