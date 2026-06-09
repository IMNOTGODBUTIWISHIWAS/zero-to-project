import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Circle,
  Clock,
  ExternalLink,
  Filter,
  GitBranch,
  GraduationCap,
  Heart,
  Lightbulb,
  Search,
  Sparkles,
  Terminal,
  Wrench
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { articlePaths, catalog, categories, languages } from "./lib/catalog";
import { curationStandard, reviewCuration } from "./lib/curationStandard";
import { loadProgress, saveProgress, toggleFavorite, toggleRecord } from "./lib/progress";
import type { ConceptModule, DifficultyLevel, ProjectPath, ResourceLink, TutorialArticle, TutorialSpecificGuide } from "./lib/types";

type EnrichedArticle = (typeof articlePaths)[number];
type CatalogMode = "learn" | "curate";
type TabKey = "learn" | "concepts" | "build" | "review" | "curation";

const difficultyLabels: Record<DifficultyLevel, string> = {
  starter: "Starter",
  guided: "Guided",
  advanced: "Advanced",
  expert: "Expert"
};

const tabs: Array<{ key: TabKey; label: string; icon: typeof BookOpen }> = [
  { key: "learn", label: "Learn First", icon: GraduationCap },
  { key: "concepts", label: "Concepts", icon: Lightbulb },
  { key: "build", label: "Build", icon: Wrench },
  { key: "review", label: "Review", icon: GitBranch },
  { key: "curation", label: "Curation", icon: ClipboardCheck }
];

export function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("all");
  const [health, setHealth] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [catalogMode, setCatalogMode] = useState<CatalogMode>("learn");
  const [tab, setTab] = useState<TabKey>("learn");
  const [progress, setProgress] = useState(() => loadProgress());
  const [selectedId, setSelectedId] = useState(
    progress.lastOpenedArticleId ?? articlePaths[0]?.article.id ?? ""
  );

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return articlePaths
      .filter(({ article, path }) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          article.title.toLowerCase().includes(normalizedQuery) ||
          article.category.toLowerCase().includes(normalizedQuery) ||
          article.languages.some((item) => item.toLowerCase().includes(normalizedQuery));
        const matchesCategory = category === "all" || article.category === category;
        const matchesLanguage = language === "all" || article.languages.includes(language);
        const matchesHealth = health === "all" || article.health.status === health;
        const matchesDifficulty = difficulty === "all" || path.difficulty === difficulty;

        return (
          matchesQuery &&
          matchesCategory &&
          matchesLanguage &&
          matchesHealth &&
          matchesDifficulty
        );
      })
      .sort((a, b) => {
        if (catalogMode === "curate") {
          const bReview = reviewCuration(b.article, b.path);
          const aReview = reviewCuration(a.article, a.path);

          return bReview.riskScore - aReview.riskScore || b.path.beginnerScore - a.path.beginnerScore;
        }

        return b.path.beginnerScore - a.path.beginnerScore;
      });
  }, [catalogMode, category, difficulty, health, language, query]);

  useEffect(() => {
    if (!selectedId && filtered[0]) {
      setSelectedId(filtered[0].article.id);
    }
  }, [filtered, selectedId]);

  const selected =
    articlePaths.find(({ article }) => article.id === selectedId) ?? filtered[0] ?? articlePaths[0];

  const stats = useMemo(() => {
    const okCount = catalog.articles.filter((article) => article.health.status === "ok").length;
    const deadCount = catalog.articles.filter((article) => article.health.status === "dead").length;
    const favoriteCount = progress.favoriteArticleIds.length;
    const curatedCount = catalog.articles.filter((article) => article.curation?.level === "curated").length;
    const researchBackedCount = catalog.articles.filter((article) => article.curation?.level === "research-backed").length;
    const fallbackCount = catalog.articles.filter((article) =>
      article.curation?.level === "generated" ||
      article.curation?.source.includes("Catalog-wide researched curation safety net")
    ).length;
    const reviewNeededCount = catalog.articles.filter((article) =>
      article.curation?.status !== "approved"
    ).length;
    const reviewCount = articlePaths.filter(({ article, path }) =>
      ["critical", "high"].includes(reviewCuration(article, path).priority)
    ).length;

    return {
      total: catalog.articles.length,
      okCount,
      deadCount,
      favoriteCount,
      curatedCount,
      researchBackedCount,
      fallbackCount,
      reviewNeededCount,
      reviewCount
    };
  }, [progress.favoriteArticleIds.length]);

  function openArticle(articleId: string) {
    setSelectedId(articleId);
    setTab("learn");
    setProgress((current) => ({
      ...current,
      lastOpenedArticleId: articleId
    }));
  }

  function toggleModule(moduleId: string) {
    setProgress((current) => ({
      ...current,
      completedModules: toggleRecord(current.completedModules, moduleId)
    }));
  }

  function toggleMilestone(milestoneId: string) {
    setProgress((current) => ({
      ...current,
      completedMilestones: toggleRecord(current.completedMilestones, milestoneId)
    }));
  }

  function updateNotes(articleId: string, notes: string) {
    setProgress((current) => ({
      ...current,
      notesByArticleId: {
        ...current.notesByArticleId,
        [articleId]: notes
      }
    }));
  }

  function dismissWarnings(articleId: string) {
    setProgress((current) => ({
      ...current,
      dismissedWarnings: {
        ...current.dismissedWarnings,
        [articleId]: true
      }
    }));
  }

  function toggleFavoriteId(articleId: string) {
    setProgress((current) => ({
      ...current,
      favoriteArticleIds: toggleFavorite(current.favoriteArticleIds, articleId)
    }));
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Catalog filters">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="eyebrow">Zero to Project</p>
            <h1>Build it, but actually learn it.</h1>
          </div>
        </div>

        <div className="search-box">
          <Search size={18} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, languages, ideas"
            aria-label="Search projects"
          />
        </div>

        <div className="mode-toggle" aria-label="Catalog mode">
          <button
            type="button"
            className={catalogMode === "learn" ? "active" : ""}
            onClick={() => setCatalogMode("learn")}
          >
            Learn
          </button>
          <button
            type="button"
            className={catalogMode === "curate" ? "active" : ""}
            onClick={() => setCatalogMode("curate")}
          >
            Curate
          </button>
        </div>

        <div className="filter-stack">
          <label>
            <span>
              <Filter size={16} aria-hidden="true" />
              Category
            </span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Language</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="all">All languages</option>
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Link health</span>
            <select value={health} onChange={(event) => setHealth(event.target.value)}>
              <option value="all">Any health</option>
              <option value="ok">Verified</option>
              <option value="unknown">Unknown</option>
              <option value="dead">Dead</option>
            </select>
          </label>

          <label>
            <span>Beginner load</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option value="all">Any level</option>
              <option value="starter">Starter</option>
              <option value="guided">Guided</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </label>
        </div>

        {catalogMode === "curate" ? (
          <div className="stat-grid" aria-label="Catalog curation stats">
            <Stat label="Approved" value={stats.curatedCount} />
            <Stat label="Research" value={stats.researchBackedCount} />
            <Stat label="Review" value={stats.reviewNeededCount} />
            <Stat label="Fallback" value={stats.fallbackCount} />
          </div>
        ) : (
          <div className="stat-grid" aria-label="Catalog stats">
            <Stat label="Projects" value={stats.total} />
            <Stat label="Verified" value={stats.okCount} />
            <Stat label="Dead" value={stats.deadCount} />
            <Stat label="Saved" value={stats.favoriteCount} />
          </div>
        )}
      </aside>

      <section className="catalog-column" aria-label="Project catalog">
        <div className="column-header">
          <div>
            <p className="eyebrow">Beginner-ranked catalog</p>
            <h2>{filtered.length} {catalogMode === "curate" ? "reviews" : "paths"}</h2>
          </div>
          <p className="sync-note">
            {catalogMode === "curate"
              ? "Research-backed queue, highest risk first."
              : "Source synced from Build Your Own X."}
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyCatalog />
        ) : (
          <div className="project-list">
            {filtered.map((item) => (
              <ProjectCard
                key={item.article.id}
                item={item}
                isSelected={selected?.article.id === item.article.id}
                isFavorite={progress.favoriteArticleIds.includes(item.article.id)}
                moduleProgress={completionCount(
                  item.path.prerequisites.map((module) => module.id),
                  progress.completedModules
                )}
                milestoneProgress={completionCount(
                  (item.article.tutorialGuide?.checkpoints.map((checkpoint) => checkpoint.id) ??
                    item.path.milestones.map((milestone) => milestone.id)),
                  progress.completedMilestones
                )}
                buildTotal={
                  item.article.tutorialGuide?.checkpoints.length ?? item.path.milestones.length
                }
                onOpen={() => openArticle(item.article.id)}
                onFavorite={() => toggleFavoriteId(item.article.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="detail-pane" aria-label="Selected learning path">
        {selected ? (
          <ProjectDetail
            article={selected.article}
            path={selected.path}
            tab={tab}
            setTab={setTab}
            completedModules={progress.completedModules}
            completedMilestones={progress.completedMilestones}
            notes={progress.notesByArticleId[selected.article.id] ?? ""}
            warningsDismissed={progress.dismissedWarnings[selected.article.id] ?? false}
            isFavorite={progress.favoriteArticleIds.includes(selected.article.id)}
            onToggleModule={toggleModule}
            onToggleMilestone={toggleMilestone}
            onNotesChange={(notes) => updateNotes(selected.article.id, notes)}
            onDismissWarnings={() => dismissWarnings(selected.article.id)}
            onFavorite={() => toggleFavoriteId(selected.article.id)}
          />
        ) : (
          <EmptyCatalog />
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ResourceAnchor({ resource }: { resource: ResourceLink }) {
  const audit = resource.audit;

  return (
    <a href={resource.url} target="_blank" rel="noreferrer" className="resource-link">
      <span>
        {resource.provider}: {resource.label}
      </span>
      {audit ? (
        <span
          className={`source-audit source-audit-${audit.status}`}
          title={`${audit.status}; verdict: ${audit.verdict}. ${audit.scope}`}
        >
          {audit.status === "read-in-full" ? "read audit" : audit.status}
        </span>
      ) : null}
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  );
}

function ProjectCard({
  item,
  isSelected,
  isFavorite,
  moduleProgress,
  milestoneProgress,
  buildTotal,
  onOpen,
  onFavorite
}: {
  item: EnrichedArticle;
  isSelected: boolean;
  isFavorite: boolean;
  moduleProgress: number;
  milestoneProgress: number;
  buildTotal: number;
  onOpen: () => void;
  onFavorite: () => void;
}) {
  const { article, path } = item;
  const healthClass = `health health-${article.health.status}`;
  const curation = article.curation ?? path.curation;
  const review = reviewCuration(article, path);

  return (
    <article className={`project-card ${isSelected ? "selected" : ""}`}>
      <button className="project-open" onClick={onOpen} type="button">
        <span className="project-meta">
          <span className="category-pill">{article.category}</span>
          <span className={healthClass}>{article.health.status}</span>
          <span className={`curation-pill curation-${curation?.level ?? "generated"}`}>
            {curation?.level ?? "generated"}
          </span>
          {review.priority !== "low" ? (
            <span className={`review-pill review-${review.priority}`}>
              {review.priority}
            </span>
          ) : null}
        </span>
        <h3>{article.title}</h3>
        <span className="language-row">{article.languages.join(" / ")}</span>
        <span className="project-progress">
          <span>
            <GraduationCap size={14} aria-hidden="true" />
            {moduleProgress}/{path.prerequisites.length}
          </span>
          <span>
            <CheckCircle2 size={14} aria-hidden="true" />
            {milestoneProgress}/{buildTotal}
          </span>
          <span>
            <Clock size={14} aria-hidden="true" />
            {path.estimatedWeeks}w
          </span>
        </span>
      </button>
      <div className="project-actions">
        <span className={`difficulty difficulty-${path.difficulty}`}>
          {difficultyLabels[path.difficulty]}
        </span>
        <button
          type="button"
          className={`icon-button ${isFavorite ? "active" : ""}`}
          onClick={onFavorite}
          title={isFavorite ? "Remove favorite" : "Save favorite"}
          aria-label={isFavorite ? "Remove favorite" : "Save favorite"}
        >
          <Heart size={17} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function ProjectDetail({
  article,
  path,
  tab,
  setTab,
  completedModules,
  completedMilestones,
  notes,
  warningsDismissed,
  isFavorite,
  onToggleModule,
  onToggleMilestone,
  onNotesChange,
  onDismissWarnings,
  onFavorite
}: {
  article: TutorialArticle;
  path: ProjectPath;
  tab: TabKey;
  setTab: (tab: TabKey) => void;
  completedModules: Record<string, boolean>;
  completedMilestones: Record<string, boolean>;
  notes: string;
  warningsDismissed: boolean;
  isFavorite: boolean;
  onToggleModule: (moduleId: string) => void;
  onToggleMilestone: (milestoneId: string) => void;
  onNotesChange: (notes: string) => void;
  onDismissWarnings: () => void;
  onFavorite: () => void;
}) {
  const showWarnings = path.warnings.length > 0 && !warningsDismissed;
  const curation = article.curation ?? path.curation;

  return (
    <div className="detail-content">
      <header className="project-header">
        <div>
          <p className="eyebrow">{article.category}</p>
          <h2>{article.title}</h2>
          <div className="header-tags">
            <span>{article.languages.join(" / ")}</span>
            <span>{difficultyLabels[path.difficulty]}</span>
            <span>{path.estimatedWeeks} week path</span>
            <span>{path.beginnerScore}% beginner fit</span>
            {article.qualityAudit ? (
              <span>{article.qualityAudit.overall.score}% quality</span>
            ) : null}
            {curation ? <span>{curation.level} curation</span> : null}
          </div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className={`icon-button large ${isFavorite ? "active" : ""}`}
            onClick={onFavorite}
            title={isFavorite ? "Remove favorite" : "Save favorite"}
            aria-label={isFavorite ? "Remove favorite" : "Save favorite"}
          >
            <Heart size={19} aria-hidden="true" />
          </button>
          <a href={article.url} target="_blank" rel="noreferrer" className="external-link">
            Tutorial
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      {showWarnings ? (
        <section className="warning-band" aria-label="Beginner warnings">
          <AlertTriangle size={19} aria-hidden="true" />
          <div>
            {path.warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
          <button type="button" onClick={onDismissWarnings}>
            Dismiss
          </button>
        </section>
      ) : null}

      <nav className="tabs" aria-label="Learning path sections">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={tab === key ? "active" : ""}
            onClick={() => setTab(key)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      {tab === "learn" ? (
        <LearnFirst
          path={path}
          completedModules={completedModules}
          onToggleModule={onToggleModule}
        />
      ) : null}

      {tab === "concepts" ? <Concepts path={path} /> : null}

      {tab === "build" ? (
        <BuildPlan
          article={article}
          path={path}
          completedMilestones={completedMilestones}
          onToggleMilestone={onToggleMilestone}
        />
      ) : null}

      {tab === "review" ? (
        <ReviewPlan article={article} path={path} notes={notes} onNotesChange={onNotesChange} />
      ) : null}

      {tab === "curation" ? <CurationPanel article={article} path={path} /> : null}
    </div>
  );
}

function LearnFirst({
  path,
  completedModules,
  onToggleModule
}: {
  path: ProjectPath;
  completedModules: Record<string, boolean>;
  onToggleModule: (moduleId: string) => void;
}) {
  return (
    <div className="section-stack">
      <section className="intro-strip">
        <Terminal size={21} aria-hidden="true" />
        <div>
          <h3>Start here, even with no background.</h3>
          <p>
            These are the exact basics to learn before the tutorial. Each item has a plain
            explanation, a free resource, a practice task, and a self-check.
          </p>
        </div>
      </section>

      <div className="module-list">
        {path.prerequisites.map((module, index) => {
          const isDone = completedModules[module.id] ?? false;
          const resources = uniqueResourceLinks([module.resource, ...(module.resources ?? [])]);

          return (
            <article className="module-row" key={module.id}>
              <button
                type="button"
                className={`check-button ${isDone ? "done" : ""}`}
                onClick={() => onToggleModule(module.id)}
                title={isDone ? "Mark incomplete" : "Mark complete"}
                aria-label={isDone ? "Mark incomplete" : "Mark complete"}
              >
                {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
              <div className="module-body">
                <div className="module-heading">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h4>{module.title}</h4>
                  <em>{module.estimatedMinutes} min</em>
                </div>
                <p>{module.summary}</p>
                <div className="learning-callouts">
                  <div>
                    <strong>Why this matters</strong>
                    <p>{module.whyItMatters}</p>
                  </div>
                  <div>
                    <strong>Practice</strong>
                    <p>{module.exercise}</p>
                  </div>
                  <div>
                    <strong>Self-check</strong>
                    <p>{module.selfCheck}</p>
                  </div>
                </div>
                <div className="module-resources">
                  <strong>Learning resources</strong>
                  {resources.slice(0, 4).map((resource) => (
                    <ResourceAnchor resource={resource} key={resource.url} />
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Concepts({ path }: { path: ProjectPath }) {
  const resourceGroups = conceptResourceGroups(path.concepts);

  return (
    <div className="section-stack">
      {path.conceptQualityAudit ? (
        <section className="build-status build-status-full">
          <div>
            <strong>Concept quality: {path.conceptQualityAudit.verdict}</strong>
            <p>
              {path.conceptQualityAudit.score}% score across tutorial specificity, explanation
              depth, and understanding checks.
            </p>
          </div>
          <span>{path.conceptQualityAudit.issues.length} issues</span>
        </section>
      ) : null}

      <div className="concept-grid">
        {path.concepts.map((concept, index) => (
          <article className="concept-card" key={concept.id}>
            <div className="concept-icon" aria-hidden="true">
              <Lightbulb size={20} />
            </div>
            <h3>{concept.title}</h3>
            <p>{concept.plainEnglish}</p>
            <strong>Why it matters</strong>
            <p>{concept.whyItMatters}</p>
            <ul>
              {concept.signsYouUnderstand.map((sign) => (
                <li key={sign}>{sign}</li>
              ))}
            </ul>
            <div className="concept-resources">
              <strong>Learn deeper</strong>
              {resourceGroups[index].map((resource) => (
                <ResourceAnchor resource={resource} key={resource.url} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function BuildPlan({
  article,
  path,
  completedMilestones,
  onToggleMilestone
}: {
  article: TutorialArticle;
  path: ProjectPath;
  completedMilestones: Record<string, boolean>;
  onToggleMilestone: (milestoneId: string) => void;
}) {
  const guide = article.tutorialGuide ?? fallbackGuide(article, path);
  const extraction = article.extraction;

  return (
    <div className="section-stack">
      <section className="tutorial-band">
        <div>
          <p className="eyebrow">Tutorial-specific build guide</p>
          <h3>{guide.confidenceLabel}</h3>
          <p>
            This guide is derived or curated from the tutorial structure and rewritten as beginner
            checkpoints. The original tutorial stays linked as the source of truth.
          </p>
        </div>
        <a href={article.url} target="_blank" rel="noreferrer" className="external-link">
          Open Tutorial
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </section>

      <section className={`build-status build-status-${guide.extractionStatus}`}>
        <div>
          <strong>
            {guide.confidenceLabel}
            {guide.qualityAudit ? ` - ${guide.qualityAudit.score}% quality` : ""}
          </strong>
          <p>
            {extraction
              ? `${Math.round(extraction.confidence * 100)}% extraction confidence from ${extraction.sourceKind}.`
              : "Generated from fallback project scaffolding."}
          </p>
        </div>
        <span>{guide.qualityAudit?.verdict ?? (guide.sourceRequired ? "source required" : "custom guide")}</span>
      </section>

      {guide.qualityAudit && guide.qualityAudit.issues.length > 0 ? (
        <section className="quality-issues" aria-label="Build quality audit">
          <h3>Quality audit</h3>
          <ul>
            {guide.qualityAudit.issues.slice(0, 5).map((issue) => (
              <li key={issue.id}>
                <strong>{issue.severity}</strong> {issue.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {guide.fallbackReason ? (
        <section className="warning-band" aria-label="Extraction fallback">
          <AlertTriangle size={19} aria-hidden="true" />
          <div>
            <p>{guide.fallbackReason}</p>
          </div>
        </section>
      ) : null}

      <section className="guide-setup">
        <h3>Setup before coding</h3>
        <ol>
          {guide.setupSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {guide.resourceLinks && guide.resourceLinks.length > 0 ? (
        <section className="guide-setup resource-panel">
          <h3>Research stack for this build</h3>
          <div className="resource-list">
            {uniqueResourceLinks(guide.resourceLinks).map((resource) => (
              <ResourceAnchor resource={resource} key={resource.url} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="checkpoint-list">
        {guide.checkpoints.map((checkpoint, index) => {
          const isDone = completedMilestones[checkpoint.id] ?? false;
          const checkpointResources = checkpointResourcesForDisplay(
            checkpoint.resourceLinks ?? [],
            guide.resourceLinks ?? []
          );

          return (
            <article className="checkpoint-card" key={checkpoint.id}>
              <button
                type="button"
                className={`check-button ${isDone ? "done" : ""}`}
                onClick={() => onToggleMilestone(checkpoint.id)}
                title={isDone ? "Mark incomplete" : "Mark complete"}
                aria-label={isDone ? "Mark incomplete" : "Mark complete"}
              >
                {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
              <div className="checkpoint-body">
                <span className="step-label">Checkpoint {index + 1}</span>
                <h4>{checkpoint.title}</h4>
                {checkpoint.sourceSectionTitle ? (
                  <em>From tutorial section: {checkpoint.sourceSectionTitle}</em>
                ) : null}
                <div className="checkpoint-grid">
                  <div>
                    <strong>Beginner goal</strong>
                    <p>{checkpoint.beginnerGoal}</p>
                  </div>
                  <div>
                    <strong>Learn right here</strong>
                    <p>{checkpoint.learnRightHere}</p>
                  </div>
                  <div>
                    <strong>Build action</strong>
                    <p>{checkpoint.action}</p>
                  </div>
                  <div>
                    <strong>Self-check</strong>
                    <p>{checkpoint.selfCheck}</p>
                  </div>
                </div>
                <p className="debug-prompt">
                  <strong>Debug prompt:</strong> {checkpoint.debugPrompt}
                </p>
                {checkpointResources.length > 0 ? (
                  <div className="checkpoint-resources">
                    <strong>Learn for this checkpoint</strong>
                    {checkpointResources.map((resource) => (
                      <ResourceAnchor resource={resource} key={resource.url} />
                    ))}
                  </div>
                ) : null}
              </div>
              <ChevronRight size={18} aria-hidden="true" />
            </article>
          );
        })}
      </div>

      <section className="guide-setup">
        <h3>Final proof tasks</h3>
        <ul className="proof-list">
          {guide.finalProofTasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function fallbackGuide(article: TutorialArticle, path: ProjectPath): TutorialSpecificGuide {
  const fallbackResources = uniqueResourceLinks([
    ...path.concepts.slice(0, 3).flatMap((concept) => concept.resources),
    ...path.prerequisites.slice(0, 3).flatMap((module) => [module.resource, ...(module.resources ?? [])])
  ]).slice(0, 6);

  return {
    articleId: article.id,
    extractionStatus: "unknown" as const,
    confidenceLabel: "Open tutorial required",
    sourceRequired: true,
    setupSteps: [
      `Create a repository for "${article.title}".`,
      `Prepare the ${article.languages.join(" / ")} toolchain.`,
      "Open the original tutorial and use these fallback checkpoints as your beginner safety rails."
    ],
    resourceLinks: fallbackResources,
    checkpoints: path.milestones.map((milestone, index) => ({
      id: `${article.id}-fallback-${index + 1}`,
      title: milestone.title,
      beginnerGoal: milestone.description,
      learnRightHere: "Review the Learn First and Concepts tabs before attempting this step.",
      action: milestone.description,
      selfCheck: milestone.proof,
      debugPrompt: "If this fails, reduce the step to the smallest input and output you can test.",
      prerequisiteModuleIds: path.prerequisites.slice(0, 2).map((module) => module.id),
      resourceLinks: fallbackResources.slice(0, 4)
    })),
    finalProofTasks: [
      "Demo the project from a clean start.",
      "Document setup and known limitations in the README."
    ],
    fallbackReason: "This catalog entry has not been regenerated with tutorial extraction yet.",
    aiEnhanced: false
  };
}

function uniqueResourceLinks(resources: ResourceLink[]): ResourceLink[] {
  const seen = new Set<string>();

  return resources.filter((resource) => {
    const key = resource.url.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function checkpointResourcesForDisplay(resources: ResourceLink[], sharedResources: ResourceLink[]): ResourceLink[] {
  const shared = new Set(sharedResources.map((resource) => resource.url.toLowerCase()));
  const specific = uniqueResourceLinks(resources).filter((resource) => !shared.has(resource.url.toLowerCase()));

  return (specific.length >= 2 ? specific : uniqueResourceLinks(resources)).slice(0, 3);
}

function conceptResourceGroups(concepts: ConceptModule[]): ResourceLink[][] {
  const seen = new Set<string>();

  return concepts.map((concept) => {
    const unique = uniqueResourceLinks(concept.resources);
    const fresh = unique.filter((resource) => !seen.has(resource.url.toLowerCase()));
    const displayed = (fresh.length >= 2 ? fresh : unique).slice(0, 3);

    displayed.forEach((resource) => seen.add(resource.url.toLowerCase()));
    return displayed;
  });
}

function CurationPanel({ article, path }: { article: TutorialArticle; path: ProjectPath }) {
  const review = reviewCuration(article, path);
  const curation = article.curation ?? path.curation;
  const buildIssues = article.tutorialGuide?.qualityAudit?.issues ?? [];
  const conceptIssues = path.conceptQualityAudit?.issues ?? [];
  const resourceAudit = article.qualityAudit?.resources;
  const resourceIssues = resourceAudit?.issues ?? [];

  return (
    <div className="section-stack">
      <section className={`curation-summary priority-${review.priority}`}>
        <div>
          <p className="eyebrow">Curation standard</p>
          <h3>{review.priority} priority</h3>
          <p>
            Risk score {review.riskScore}/100. Generated guidance is treated as draft until a
            curated or research-backed override proves the bridge is tutorial-specific.
          </p>
        </div>
        <span>{curation?.level ?? "generated"}</span>
      </section>

      {curation ? (
        <section className="guide-setup">
          <h3>Current curation record</h3>
          <p>{curation.summary}</p>
          <ul className="plain-list">
            <li>Source: {curation.source}</li>
            <li>Status: {curation.status}</li>
            <li>Standard: {curation.standardVersion}</li>
            <li>Updated: {curation.updatedAt}</li>
          </ul>
          <ul className="plain-list">
            {curation.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="guide-setup">
        <h3>Required standard</h3>
        <ul className="plain-list">
          {curationStandard.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="guide-setup">
        <h3>Review signals</h3>
        {review.signals.length > 0 ? (
          <ul className="plain-list">
            {review.signals.map((signal) => (
              <li key={signal.id}>
                <strong>{signal.severity}</strong> {signal.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No curation risk signals are currently active.</p>
        )}
      </section>

      <section className="guide-setup">
        <h3>Audit issues</h3>
        <div className="audit-columns">
          <div>
            <strong>Concepts</strong>
            {conceptIssues.length > 0 ? (
              <ul className="plain-list">
                {conceptIssues.slice(0, 6).map((issue) => (
                  <li key={issue.id}>{issue.message}</li>
                ))}
              </ul>
            ) : (
              <p>No concept audit issues.</p>
            )}
          </div>
          <div>
            <strong>Build</strong>
            {buildIssues.length > 0 ? (
              <ul className="plain-list">
                {buildIssues.slice(0, 6).map((issue) => (
                  <li key={issue.id}>{issue.message}</li>
                ))}
              </ul>
            ) : (
              <p>No build audit issues.</p>
            )}
          </div>
          <div>
            <strong>Resources</strong>
            {resourceAudit ? (
              <p>
                {resourceAudit.score}% score, {resourceAudit.uniqueLinks}/{resourceAudit.totalLinks} unique links, {resourceAudit.providerCount} providers.
              </p>
            ) : (
              <p>Resource audit has not been generated yet.</p>
            )}
            {resourceIssues.length > 0 ? (
              <ul className="plain-list">
                {resourceIssues.slice(0, 6).map((issue) => (
                  <li key={issue.id}>{issue.message}</li>
                ))}
              </ul>
            ) : resourceAudit ? (
              <p>No resource audit issues.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewPlan({
  article,
  path,
  notes,
  onNotesChange
}: {
  article: TutorialArticle;
  path: ProjectPath;
  notes: string;
  onNotesChange: (notes: string) => void;
}) {
  return (
    <div className="review-layout">
      <section>
        <h3>Debugging checklist</h3>
        <ul className="plain-list">
          {path.debuggingChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>CV/profile framing</h3>
        <p>{path.cvFraming}</p>
        <h3>Next steps</h3>
        <ul className="plain-list">
          {path.nextSteps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="notes-panel">
        <label htmlFor="notes">Project notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder={`What did you learn from ${article.title}?`}
        />
      </section>
    </div>
  );
}

function EmptyCatalog() {
  return (
    <div className="empty-state">
      <BookOpen size={32} aria-hidden="true" />
      <h2>No projects loaded yet</h2>
      <p>Run npm.cmd run sync:byox to pull the Build Your Own X catalog into the app.</p>
    </div>
  );
}

function completionCount(ids: string[], completed: Record<string, boolean>): number {
  return ids.filter((id) => completed[id]).length;
}
