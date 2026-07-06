import type { ServiceCatalogEntry } from './types';

export const normalizeSearchInput = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const getEntryScore = (normalizedQuery: string, value: string, exactAlias: boolean): number => {
  const normalizedValue = normalizeSearchInput(value);
  if (normalizedValue === normalizedQuery) {
    return exactAlias ? 95 : 100;
  }
  if (normalizedValue.startsWith(normalizedQuery)) {
    return exactAlias ? 85 : 70;
  }
  if (normalizedValue.includes(normalizedQuery)) {
    return exactAlias ? 55 : 35;
  }
  return 0;
};

export const getServiceMatchScore = (query: string, service: ServiceCatalogEntry): number => {
  const normalizedQuery = normalizeSearchInput(query);
  if (!normalizedQuery) return 0;

  let bestScore = 0;

  for (const keyword of service.keywords) {
    bestScore = Math.max(bestScore, getEntryScore(normalizedQuery, keyword, false));
  }

  for (const alias of service.aliases) {
    bestScore = Math.max(bestScore, getEntryScore(normalizedQuery, alias, true));
  }

  return bestScore;
};

export const getSearchSuggestions = (
  query: string,
  catalog: ServiceCatalogEntry[]
): ServiceCatalogEntry[] => {
  const normalizedQuery = normalizeSearchInput(query);
  if (!normalizedQuery) return [];

  return catalog
    .map((service) => ({
      service,
      score: getServiceMatchScore(normalizedQuery, service)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.service.title.localeCompare(b.service.title);
    })
    .map(item => item.service);
};

export const getUniqueSuggestionSlug = (
  query: string,
  catalog: ServiceCatalogEntry[]
): string | null => {
  const suggestions = getSearchSuggestions(query, catalog);
  if (suggestions.length === 1) {
    return suggestions[0].slug;
  }
  return null;
};
