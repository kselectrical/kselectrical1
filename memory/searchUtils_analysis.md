# Analysis of frontend/src/searchUtils.ts

## Overview
This file contains utility functions for searching and matching services in a service catalog. It provides fuzzy matching capabilities using Levenshtein distance and scoring mechanisms to rank services based on search queries.

## Functions Explained

### 1. `levenshteinDistance(s1: string, s2: string): number`
Calculates the Levenshtein distance (edit distance) between two strings using dynamic programming.
- **Parameters**:
  - `s1`: First string
  - `s2`: Second string
- **Returns**: Number representing the minimum number of single-character edits (insertions, deletions, substitutions) required to change one string into the other.
- **Implementation**:
  - Creates a 2D DP array where `dp[i][j]` represents the distance between first `i` characters of `s1` and first `j` characters of `s2`
  - Initializes first row and column with incremental values (base cases)
  - Iterates through both strings, computing cost (0 if characters match, 1 otherwise)
  - For each cell, takes minimum of:
    * Deletion: `dp[i-1][j] + 1`
    * Insertion: `dp[i][j-1] + 1`
    * Substitution: `dp[i-1][j-1] + cost`
  - Returns `dp[m][n]` where m and n are lengths of s1 and s2

### 2. `normalizeSearchInput(value: string): string`
Normalizes a search string for consistent comparison.
- **Parameters**:
  - `value`: Input string to normalize
- **Returns**: Normalized string (lowercase, alphanumeric and spaces only, trimmed)
- **Steps**:
  1. Convert to lowercase
  2. Replace non-alphanumeric characters (except spaces) with spaces
  3. Collapse multiple spaces into single space
  4. Trim leading/trailing whitespace
- **Purpose**: Ensures consistent comparison regardless of case, punctuation, or extra whitespace

### 3. `getEntryScore(normalizedQuery: string, value: string, exactAlias: boolean): number`
Calculates a relevance score for how well a value matches a normalized query.
- **Parameters**:
  - `normalizedQuery`: Pre-normalized search query
  - `value`: String to match against (keyword or alias)
  - `exactAlias`: Boolean indicating if the value is an alias (affects scoring)
- **Returns**: Score between 0-100 indicating match quality
- **Logic**:
  1. Normalizes the input value
  2. If normalized value exactly matches query: returns 100 (or 95 for alias)
  3. Else if value starts with query: returns 70 (or 85 for alias)
  4. Else if value contains query: returns 35 (or 55 for alias)
  5. Else: returns 0
- **Rationale**: Exact matches score highest, prefix matches medium, substring matches lowest. Aliases get slightly lower scores than direct keywords to prioritize exact service properties.

### 4. `getServiceMatchScore(query: string, service: ServiceCatalogEntry): number`
Calculates the best match score for a service against a search query.
- **Parameters**:
  - `query`: Raw search query string
  - `service`: ServiceCatalogEntry object containing title, keywords, aliases, etc.
- **Returns**: highest score from matching against service's keywords and aliases
- **Process**:
  1. Normalizes the query
  2. Returns 0 if query is empty after normalization
  3. Iterates through service's keywords, computing score for each (exactAlias=false)
  4. Iterates through service's aliases, computing score for each (exactAlias=true)
  5. Returns the maximum score found
- **Purpose**: Determines how relevant a service is to a search query by checking all its searchable fields

### 5. `getSearchSuggestions(query: string, catalog: ServiceCatalogEntry[]): ServiceCatalogEntry[]`
Returns services sorted by relevance to a search query.
- **Parameters**:
  - `query`: Raw search query string
  - `catalog`: Array of service objects to search through
- **Returns**: Array of services sorted by relevance (highest score first), then alphabetically by title
- **Process**:
  1. Normalizes query, returns empty array if empty
  2. Maps each service to an object containing the service and its match score
  3. Filters out services with score 0 (no match)
  4. Sorts by:
     * Descending score
     * Ascending title (localeCompare) for tie-breaking
  5. Returns just the service objects (discarding the score wrapper)
- **Purpose**: Provides ranked search results for UI display

### 6. `getUniqueSuggestionSlug(query: string, catalog: ServiceCatalogEntry[]): string | null`
Returns the slug of the uniquely matching service, if exactly one service matches.
- **Parameters**:
  - `query`: Raw search query string
  - `catalog`: Array of service objects to search through
- **Returns**: Slug of the single matching service, or null if zero or multiple matches
- **Process**:
  1. Gets search suggestions using `getSearchSuggestions`
  2. If exactly one suggestion, returns its slug
  3. Otherwise returns null
- **Purpose**: Used for "direct navigation" when a search query uniquely identifies a service

## Bugs Found

### 1. Inconsistent Scoring for Aliases vs Keywords
- **Location**: Lines 61-63 in `getServiceMatchScore`
- **Issue**: Aliases are checked with `exactAlias=true`, which reduces their scores by 10-20 points compared to keywords. However, the rationale for this difference isn't clear and may not align with user expectations. If aliases are alternative names for services, they should arguably be weighted similarly to keywords.
- **Impact**: Services might be ranked lower when matched via alias vs keyword, potentially affecting search relevance.

### 2. Inconsistent Use of Normalization
- **Location**: Line 52 in `getServiceMatchScore` and line 38 in `getEntryScore`
- **Issue**: The function `getServiceMatchScore` normalizes the query once, then passes it to `getEntryScore`. However, `getEntryScore` normalizes the value again. This is inefficient but not incorrect. However, note that `getEntryScore` expects a normalized query but still normalizes the value - this is correct.
- **Impact**: Minor performance overhead from double normalization of the value.

### 3. Potential Issue with Empty Query Handling
- **Location**: Line 53 in `getServiceMatchScore`
- **Issue**: Returns 0 for empty normalized query. This is correct behavior, but note that `getSearchSuggestions` also checks for empty query and returns empty array. This is consistent.
- **Impact**: No bug, but worth noting the duplication.

### 4. Missing Handling of Diacritics/Accents
- **Location**: `normalizeSearchInput` function (lines 29-35)
- **Issue**: The normalization only handles basic Latin letters and numbers. Characters with accents (like é, ñ, ü) will be removed by the regex `[^a-z0-9 ]+/g`, converting them to spaces. This could hurt searchability for services with names in languages that use diacritics.
- **Impact**: Reduced search effectiveness for internationalized content.

### 5. Inconsistent Tie-breaking in Sorting
- **Location**: Lines 81-86 in `getSearchSuggestions`
- **Issue**: When scores are equal, sorting uses `a.service.title.localeCompare(b.service.title)`. This is good for alphabetical ordering, but note that the titles are not normalized before comparison. This could lead to unexpected ordering if titles have different cases or special characters.
- **Impact**: Minor UI inconsistency in tie-breaking scenarios.

### 6. Potential Performance Issue with Large Catalogs
- **Location**: `getSearchSuggestions` function (lines 68-88)
- **Issue**: For each service, it calculates scores against all keywords and aliases. With large catalogs and services with many keywords/aliases, this could become slow. The function does not short-circuit when a perfect score (100) is found.
- **Impact**: Performance degradation with large datasets.

### 7. Inconsistent Return Type Documentation
- **Location**: `getUniqueSuggestionSlug` function (lines 90-99)
- **Issue**: Returns `string | null` but the comment doesn't explicitly mention the null case. The function returns null when there isn't exactly one match.
- **Impact**: Minor documentation issue.

### 8. Missing Input Validation
- **Location**: All functions that accept string parameters
- **Issue**: No validation for null/undefined inputs. While TypeScript provides compile-time safety, runtime protection could be added.
- **Impact**: Potential runtime errors if non-string values are passed (though unlikely given TypeScript usage).

## Suggested Fixes

### 1. Review Alias Scoring Logic
- **Option A**: Remove the alias penalty if aliases should be weighted equally to keywords
- **Option B**: Keep the penalty but document the rationale clearly
- **Option C**: Make the penalty configurable

### 2. Optimize Normalization (Minor)
- Consider caching normalized values if the same strings are checked repeatedly
- Not critical unless profiling shows this as a bottleneck

### 3. Improve Normalization for International Characters
- Update `normalizeSearchInput` to preserve or convert accented characters rather than removing them
- Example: Use a library like `diacritics` or implement basic accent removal/mapping
- Alternative: Use Unicode-aware regex with `\p{L}` and `\p{N}` (requires ES2018+)

### 4. Normalize Titles for Consistent Sorting
- In the tie-breaker sort, normalize titles before comparison:
  ```typescript
  return a.service.title.localeCompare(b.service.title);
  ```
  Change to:
  ```typescript
  const normTitleA = normalizeSearchInput(a.service.title);
  const normTitleB = normalizeSearchInput(b.service.title);
  return normTitleA.localeCompare(normTitleB);
  ```

### 5. Add Early Exit for Perfect Matches
- In `getServiceMatchScore`, if a score of 100 is found, return immediately since it's the highest possible score
- This could significantly improve performance for queries that exactly match common terms

### 6. Add Input Validation (Defensive Programming)
- Add checks for null/undefined inputs where appropriate, though TypeScript should catch most issues at compile time

### 7. Consider Using Levenshtein Distance for Fuzzy Matching
- Currently the matching is based on exact/prefix/substring matches only
- Consider incorporating actual Levenshtein distance for more sophisticated fuzzy matching
- This would require changing the scoring algorithm significantly

## Summary of Priority Fixes

1. **High Priority**: Review alias scoring logic to ensure it aligns with product requirements
2. **Medium Priority**: Improve normalization to handle international characters better
3. **Low Priority**: Optimize for early exit on perfect matches and normalize titles for sorting
4. **Very Low Priority**: Add input validation and deduplicate normalization (minor performance)

## Note on Current State
The code is generally well-structured and follows good practices. The main concerns are around internationalization support and potential scoring inconsistencies. The algorithm is appropriate for the use case (exact/prefix/substring matching with scoring) but could be enhanced with true fuzzy matching if desired.