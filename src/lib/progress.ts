import type { LearnerProgress } from "./types";

export const progressStorageKey = "zero-to-project-progress-v1";

export const emptyProgress: LearnerProgress = {
  completedModules: {},
  completedMilestones: {},
  favoriteArticleIds: [],
  notesByArticleId: {},
  dismissedWarnings: {}
};

export function loadProgress(storage: Storage = window.localStorage): LearnerProgress {
  const raw = storage.getItem(progressStorageKey);

  if (!raw) {
    return { ...emptyProgress };
  }

  try {
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return { ...emptyProgress };
  }
}

export function saveProgress(progress: LearnerProgress, storage: Storage = window.localStorage) {
  storage.setItem(progressStorageKey, JSON.stringify(progress));
}

export function toggleRecord(record: Record<string, boolean>, id: string) {
  return {
    ...record,
    [id]: !record[id]
  };
}

export function toggleFavorite(favorites: string[], articleId: string): string[] {
  return favorites.includes(articleId)
    ? favorites.filter((id) => id !== articleId)
    : [...favorites, articleId];
}

function normalizeProgress(value: Partial<LearnerProgress>): LearnerProgress {
  return {
    completedModules: value.completedModules ?? {},
    completedMilestones: value.completedMilestones ?? {},
    favoriteArticleIds: value.favoriteArticleIds ?? [],
    notesByArticleId: value.notesByArticleId ?? {},
    dismissedWarnings: value.dismissedWarnings ?? {},
    lastOpenedArticleId: value.lastOpenedArticleId
  };
}
