# Code Review Report

## Date: 2026-01-11

---

## 1. background/ - Service Worker

### File: `src/background/index.ts`

**Status**: EMPTY - Not implemented

**Issues**:

- No implementation currently present

**Recommendations**:

- Determine if background service worker is needed for this project
- Consider implementing if any of the following are required:
  - OAuth2 token refresh logic
  - Message passing between popup and content scripts
  - Background task scheduling
  - Persistent state management

**Priority**: Low

---

## 2. popup/ - Settings Popup UI

### Files: `src/popup/App.tsx`, `src/popup/index.tsx`

**Issues**:

1. **Missing Accessibility Features** (Medium)
   - Missing ARIA labels for form inputs
   - No keyboard navigation announcements
   - No focus trap in modal-like popup

2. **Error Handling Inconsistency** (Low)
   - Status message cleared after 2 seconds automatically without user control
   - Error logging only to console, no user feedback mechanism

3. **Missing Tests** (High)
   - No unit tests for App component
   - No integration tests for save/load flow

**Recommendations**:

```typescript
// Add ARIA attributes
<input
  type="password"
  aria-label="Gemini API Key input"
  // ...
/>

// Add user-dismissable status
const handleDismissStatus = () => setStatus('');
```

**Priority**: High (tests), Medium (accessibility)

---

## 3. editor/ - Main Editor

### File: `src/editor/index.tsx`

**Issues**:

1. **Component Size - Too Large** (High)
   - 243 lines, handles multiple responsibilities
   - State management, project loading, AI generation, UI rendering all in one component

2. **Complex State Management** (High)
   - 8+ state variables managed directly
   - No state management library (Zustand/Redux) or context usage
   - Prop drilling potential in future

3. **Error Handling Gaps** (Medium)
   - `alert()` used for success message (line 65) - blocking UI pattern
   - No automatic error recovery mechanism
   - No retry logic for failed operations

4. **Missing Loading States** (Low)
   - No loading indicator for API key initialization

**Recommendations**:

```typescript
// Extract into smaller components
- <ProjectHeader /> - Script ID input, Load/Save buttons
- <EditorContainer /> - Monaco Editor wrapper
- <DiffView /> - Diff viewer with accept/reject buttons
- <ErrorToast /> - Error display component
// Use custom hook for editor state
- useEditorState() - manages code, file, project state
- useProjectOperations() - manages load/save operations
```

**Priority**: High (refactoring), Medium (error handling)

---

## 4. components/ - UI Components

### File: `src/components/PromptInput.tsx`

**Issues**:

1. **Missing Tests** (High)
   - No unit tests for form submission
   - No tests for loading state
   - No tests for disabled button behavior

2. **No Input Validation** (Low)
   - No character limit
   - No specific prompt length recommendations

**Recommendations**:

```typescript
// Add tests
describe('PromptInput', () => {
  it('should submit when prompt is not empty', () => {...});
  it('should not submit when loading', () => {...});
  it('should clear prompt after submit', () => {...});
});
```

**Priority**: High (tests)

---

### File: `src/components/DiffViewer.tsx`

**Issues**:

1. **Missing Tests** (High)
   - No unit tests for DiffViewer rendering
   - No tests for different code comparisons

2. **Hardcoded Options** (Low)
   - `readOnly: true` may limit future interactivity
   - Fixed language parameter may need flexibility

**Recommendations**:

```typescript
// Add props for more configurability
interface DiffViewerProps {
  original: string
  modified: string
  language?: string
  readOnly?: boolean // Allow editing if needed
  renderSideBySide?: boolean // Optional side-by-side view
}
```

**Priority**: High (tests)

---

## 5. lib/gemini/ - AI Client

### Files: `src/lib/gemini/client.ts`, `src/lib/gemini/types.ts`

**Issues**:

1. **No Rate Limiting** (High)
   - Multiple rapid requests could trigger API quota errors
   - No request queuing mechanism

2. **Missing Tests** (High)
   - No unit tests for `generateCode()`
   - No tests for `explainCode()`
   - No tests for error scenarios

3. **No Token Usage Tracking** (Medium)
   - No visibility into API costs
   - Hard to optimize prompts without usage metrics

4. **Error Handling** (Medium)
   - Generic error messages don't help debugging
   - No retry logic for transient failures

**Recommendations**:

```typescript
// Add rate limiting
private requestQueue: Promise<void> = Promise.resolve();

async generateCode(...) {
  await this.requestQueue;
  this.requestQueue = this._makeRequest(prompt, currentCode);
  return this.requestQueue;
}

// Add retry logic with exponential backoff
async retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {...}
```

**Priority**: High (tests, rate limiting)

---

## 6. lib/storage/ - Storage Manager

### Files: `src/lib/storage/manager.ts`, `src/lib/storage/types.ts`, `src/lib/storage/manager.test.ts`

**Issues**:

1. **Tests are Placeholder Only** (High)
   - `manager.test.ts` only has a dummy test (1+1=2)
   - No actual StorageManager functionality tested

2. **Missing Validation** (Medium)
   - No validation for API key format
   - No schema validation for settings

3. **Silent Errors** (Medium)
   - `getSettings()` returns empty object on error without rethrowing
   - Makes debugging difficult

**Recommendations**:

```typescript
// Add actual tests
describe('StorageManager', () => {
  it('should save and retrieve API key', async () => {...});
  it('should merge settings correctly', async () => {...});
  it('should handle storage errors', async () => {...});
});

// Add validation
static async setApiKey(apiKey: string): Promise<void> {
  if (!apiKey || apiKey.length < 10) {
    throw new Error('Invalid API key');
  }
  await this.saveSettings({ geminiApiKey: apiKey });
}
```

**Priority**: High (tests)

---

## 7. lib/clasp/ - GAS Project Manager

### Files: `src/lib/clasp/manager.ts`, `src/lib/clasp/api.ts`, `src/lib/clasp/types.ts`

**Issues**:

1. **No Token Refresh** (High)
   - 401 errors don't trigger token refresh
   - User must manually re-authenticate

2. **Missing Tests** (High)
   - No unit tests for ClaspManager
   - No tests for GASClient API calls
   - No mock setup for chrome.identity API

3. **Concurrent Edit Conflicts** (Medium)
   - Comments acknowledge the issue (line 36)
   - No optimistic locking or conflict resolution

4. **Limited File Type Support** (Low)
   - Only SERVER_JS, HTML, JSON types defined
   - May need extension for future features

**Recommendations**:

```typescript
// Add token refresh in GASClient
static async getAuthToken(forceRefresh = false): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken(
      { interactive: true },
      async (token) => {
        if (chrome.runtime.lastError || !token) {
          reject(new Error(chrome.runtime.lastError?.message));
          return;
        }
        // Test token validity, refresh if 401
        resolve(token);
      }
    );
  });
}

// Add tests with chrome.identity mock
beforeEach(() => {
  vi.spyOn(chrome.identity, 'getAuthToken').mockImplementation(...)
});
```

**Priority**: High (token refresh, tests)

---

## 8. types/ - Type Definitions

### File: `src/types/index.d.ts`

**Status**: EMPTY - Not used

**Issues**:

- File is empty and unused across the codebase

**Recommendations**:

- Remove the file as all types are defined in their respective modules
- If global types are needed in the future, create them then

**Priority**: Low (cleanup)

---

## Summary Statistics

| Priority | Count |
| -------- | ----- |
| High     | 14    |
| Medium   | 9     |
| Low      | 6     |

**Total Issues**: 29

---

## Recommended Action Plan

### Phase 1: Critical (High Priority)

1. Add comprehensive test coverage across all modules
2. Implement rate limiting in GeminiClient
3. Add token refresh logic in GASClient
4. Refactor EditorApp into smaller components

### Phase 2: Important (Medium Priority)

1. Improve error handling and recovery
2. Add accessibility features to popup
3. Implement proper storage validation
4. Add conflict resolution for concurrent edits

### Phase 3: Nice to Have (Low Priority)

1. Remove unused files
2. Add more configuration options
3. Improve error messages

---

## Next Steps

1. Review this report with team
2. Prioritize tasks based on immediate needs
3. Create individual issue tickets for each improvement
4. Implement changes incrementally with test coverage
