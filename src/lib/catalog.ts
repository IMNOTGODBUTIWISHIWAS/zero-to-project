import catalogData from "../data/catalog.generated.json";
import { enrichArticles } from "./curriculum";
import type { CatalogData } from "./types";

export const catalog = catalogData as CatalogData;

export const articlePaths = enrichArticles(catalog.articles);

export const categories = Array.from(new Set(catalog.articles.map((article) => article.category))).sort();

export const languages = Array.from(
  new Set(catalog.articles.flatMap((article) => article.languages))
).sort((a, b) => a.localeCompare(b));
