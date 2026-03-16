# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start dev server at http://localhost:4200
npm run build      # Production build
npm test           # Run all tests (Karma/Jasmine)
ng test --include='**/foo.spec.ts'  # Run a single test file
ng generate component feature/my-component  # Generate a component
```

## GitHub Pages deployment

Before every commit, ask the user whether they also want to build and deploy files for GitHub Pages. If yes, run these commands in order:

```bash
ng build --output-path docs --base-href /teach.me/
cp docs/browser/* docs/
rm -rf docs/browser
cp docs/index.html docs/404.html
```

Then include the updated `docs/` in the commit.

## Architecture

**TeachMe** is an Angular 17 flashcard learning app. Data is organized hierarchically: **Courses → Lessons → Cards**. All state is persisted to `localStorage` via NgRx effects.

### State Management (NgRx)

Three feature slices under `appFeatureKey`:
- `courses` — dictionary keyed by course ID
- `lessons` — dictionary keyed by lesson ID
- `cards` — dictionary keyed by card ID

State is normalized (flat dictionaries, IDs for relations). On every CRUD action, an effect saves the full app state to localStorage. On app init (`AppComponent.ngOnInit`), state is loaded back.

**Cascade deletes** are handled in effects: deleting a course dispatches removal of all its lessons; deleting a lesson dispatches removal of all its cards.

### Key Services

- `StorageManagerService` — reads/writes `appStateKey` in localStorage
- `IdGeneratorService` — auto-increment IDs, initialized from existing data to prevent collisions
- `CodecService` + `TightCompressorService` — compress lesson/course data using lz-string for shareable URLs
- `MigrationService` — converts store entities to/from portable `*Migration` interfaces (strips IDs and learning metadata) for import/export
- `TurnCardService` — swaps question/answer on cards in bulk (lesson or course scope)

### Routing

```
/courses
  /new
  /:courseId
    /lessons
      /new
      /:lessonId
        /cards
          /new
          /:cardId
/import
```

### File Layout

```
src/
  app/              # Root module, routing
  commons/          # Shared components (dialogs, empty view, icons)
  data/
    model/          # Interfaces: Course, Lesson, Card (+ *Migration variants)
    store/          # NgRx: actions, reducers, effects, selectors per entity
  feature/          # Feature components grouped by domain
    cards/
    courses/
    lessons/
    learn/          # Round-based learning flow: LearnComponent → RoundComponent → SummaryComponent
    import/
  services/         # Application services (see above)
```

### App Configuration

Centralized in `src/app/app.properties.ts`: UI labels (Polish), validation rules (e.g. name maxLength: 40), and other constants. Update this file when adding new entity types or UI strings.
