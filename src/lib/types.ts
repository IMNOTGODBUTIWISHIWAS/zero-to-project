export type HealthStatus = "ok" | "dead" | "unknown";

export type DifficultyLevel = "starter" | "guided" | "advanced" | "expert";

export type TutorialExtractionStatus = "full" | "partial" | "video" | "blocked" | "dead" | "unknown";

export type ExtractionSourceKind = "html" | "github" | "markdown" | "pdf" | "video" | "text" | "unknown";

export type CurationLevel = "generated" | "research-backed" | "curated";

export type LearningLayer =
  | "computer-basics"
  | "tooling"
  | "language"
  | "domain"
  | "project";

export interface ArticleHealth {
  status: HealthStatus;
  statusCode?: number;
  finalUrl?: string;
  title?: string;
  contentType?: string;
  checkedAt?: string;
  error?: string;
}

export interface TutorialArticle {
  id: string;
  category: string;
  languages: string[];
  title: string;
  url: string;
  isVideo: boolean;
  source: "build-your-own-x";
  health: ArticleHealth;
  extraction?: TutorialExtraction;
  tutorialGuide?: TutorialSpecificGuide;
  qualityAudit?: TutorialQualityAudit;
  curation?: CurationRecord;
}

export interface ExtractedSection {
  id: string;
  title: string;
  level: number;
  order: number;
  summary: string;
  keyTerms: string[];
  setupHints: string[];
  codeSignals: string[];
}

export interface TutorialExtraction {
  status: TutorialExtractionStatus;
  sourceKind: ExtractionSourceKind;
  confidence: number;
  title?: string;
  finalUrl?: string;
  extractedAt?: string;
  sections: ExtractedSection[];
  setupHints: string[];
  keyTerms: string[];
  codeSignals: string[];
  notes: string[];
  error?: string;
}

export type ResourceAuditStatus = "read-in-full" | "source-scanned" | "unverified";

export interface ResourceSourceAudit {
  status: ResourceAuditStatus;
  verdict: "excellent" | "strong" | "usable" | "rejected";
  auditedAt: string;
  scope: string;
  notes: string[];
}

export interface ResourceLink {
  label: string;
  url: string;
  provider: string;
  audit?: ResourceSourceAudit;
}

export interface LearningModule {
  id: string;
  title: string;
  layer: LearningLayer;
  summary: string;
  whyItMatters: string;
  resource: ResourceLink;
  resources?: ResourceLink[];
  exercise: string;
  selfCheck: string;
  estimatedMinutes: number;
}

export interface ConceptModule {
  id: string;
  title: string;
  plainEnglish: string;
  whyItMatters: string;
  signsYouUnderstand: string[];
  resources: ResourceLink[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  proof: string;
}

export interface BuildCheckpoint {
  id: string;
  title: string;
  sourceSectionTitle?: string;
  beginnerGoal: string;
  learnRightHere: string;
  action: string;
  selfCheck: string;
  debugPrompt: string;
  prerequisiteModuleIds: string[];
  resourceLinks?: ResourceLink[];
}

export interface TutorialSpecificGuide {
  articleId: string;
  extractionStatus: TutorialExtractionStatus;
  confidenceLabel: string;
  sourceRequired: boolean;
  setupSteps: string[];
  checkpoints: BuildCheckpoint[];
  resourceLinks?: ResourceLink[];
  finalProofTasks: string[];
  fallbackReason?: string;
  aiEnhanced?: boolean;
  qualityAudit?: QualityAudit;
  curation?: CurationRecord;
}

export interface ProjectPath {
  articleId: string;
  difficulty: DifficultyLevel;
  beginnerScore: number;
  estimatedWeeks: number;
  warnings: string[];
  prerequisites: LearningModule[];
  concepts: ConceptModule[];
  conceptQualityAudit?: QualityAudit;
  milestones: Milestone[];
  debuggingChecklist: string[];
  cvFraming: string;
  nextSteps: string[];
  curation?: CurationRecord;
}

export interface CurationRecord {
  level: CurationLevel;
  status: "draft" | "review-needed" | "approved";
  source: string;
  summary: string;
  standardVersion: string;
  updatedAt: string;
  notes: string[];
}

export interface QualityIssue {
  id: string;
  severity: "low" | "medium" | "high";
  target: "build" | "concepts" | "extraction" | "resources" | "overall";
  message: string;
}

export interface QualityAudit {
  score: number;
  verdict: "excellent" | "strong" | "usable" | "needs-review";
  checkedAt: string;
  issues: QualityIssue[];
  repairs: string[];
}

export interface ResourceQualityAudit extends QualityAudit {
  totalLinks: number;
  uniqueLinks: number;
  duplicateRatio: number;
  providerCount: number;
  repeatedUrls: Array<{
    url: string;
    count: number;
  }>;
}

export interface TutorialQualityAudit {
  build: QualityAudit;
  concepts: QualityAudit;
  resources: ResourceQualityAudit;
  overall: QualityAudit;
}

export interface CatalogData {
  generatedAt: string;
  sourceUrl: string;
  articles: TutorialArticle[];
}

export interface LearnerProgress {
  completedModules: Record<string, boolean>;
  completedMilestones: Record<string, boolean>;
  favoriteArticleIds: string[];
  notesByArticleId: Record<string, string>;
  dismissedWarnings: Record<string, boolean>;
  lastOpenedArticleId?: string;
}
