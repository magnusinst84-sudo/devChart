# PROGRESS.md — devChart Development Log

---

## 1. Overview

devChart is a Next.js 16 application backed by MongoDB through Mongoose, originally scaffolded as a simple task tracker where users could create tasks with a title, description, and priority level. For the AC-Tech club platform recruitment task, it is being evolved into a full Kanban-style collaboration board — the kind of tool a dev club would actually use to manage projects across members. The core transformation is moving from a flat list of tasks with a binary "completed" flag to a three-column board (To Do, In Progress, Done) where cards can be dragged between columns and that state is persisted to the database in real time. The longer-term vision includes per-task comment threads and activity logs, whose data structures are being introduced at the schema level now even though the UI for them is not yet built.

---

## 2. What Changed and Why

### `src/models/Tasks.ts`

**What changed:** The `completed` field, which was a simple boolean, was replaced with a `status` field typed as a string enum with three allowed values: `"todo"`, `"in-progress"`, and `"done"`. The default value is `"todo"`.

**Why:** A boolean can only represent two states. The moment you introduce an intermediate state — "someone is actively working on this" — a boolean breaks down. Representing the three Kanban columns as an enum is the semantically correct choice: it is self-documenting, enforced at the database level by Mongoose's `enum` validator, and maps directly to the `droppableId` strings used in the frontend drag-and-drop library. This tight coupling between the DB values and the UI column identifiers eliminates any translation layer and reduces the surface area for bugs.

**Tradeoff:** Any documents that were written to MongoDB before this schema change still have a `completed` field and no `status` field. Mongoose will not automatically backfill old documents, so they will surface as tasks with `status: undefined` in the API response. Querying for `status === "todo"` will not include them. A one-time migration script — iterating over all documents and writing `status: "todo"` where the field is absent — is the correct fix, but has not been run yet. This is documented in the Known Limitations section.

**On comments and activityLog:** Two additional fields — a `comments` array and an `activityLog` array — were added to the schema at this stage even though no UI exists for them yet. The reasoning is schema-first design: it is far less disruptive to add fields to the Mongoose model now, while the data shape is actively being thought about, than to retrofit them later when documents already exist in production. Mongoose ignores fields it does not know about by default, so these additions are backwards compatible and have zero impact on existing functionality.

---

### `src/app/api/tasks/[id]/route.ts`

**What changed:** This file did not exist before. It is a new Next.js dynamic route that exposes two HTTP handlers for a single task identified by its MongoDB `_id`.

The **PATCH** handler accepts a JSON body containing a `status` field, validates that the `id` path parameter is a structurally valid MongoDB ObjectId (using Mongoose's `Types.ObjectId.isValid()`), validates that the incoming `status` is one of the three permitted enum values, and then calls `findByIdAndUpdate` with `{ new: true }` to return the updated document.

The **DELETE** handler follows the same ObjectId validation pattern and then calls `findByIdAndDelete`, returning a confirmation message on success.

**Why two layers of validation:** The ObjectId check short-circuits before hitting the database with a malformed query — Mongoose would throw an internal CastError otherwise, which is harder to present to a client cleanly. The status enum check is a belt-and-suspenders guard: Mongoose would reject an invalid value at the schema level too, but catching it at the handler level means the response is a controlled 400 with a meaningful message rather than a 500 with a Mongoose validation error leaking through.

**Why `findByIdAndUpdate` with `{ new: true }`:** The `new: true` option tells Mongoose to return the document as it looks *after* the update, not before. This matters because the frontend does not strictly need this for optimistic updates (the new state is already known locally), but returning it is good API design — it gives the caller a source of truth to reconcile against if needed, and it makes the endpoint useful for other consumers in the future.

---

### `src/components/TaskCard.tsx`

**What changed:** Two things. First, the `completion: boolean` prop was renamed to `status: string` to match the updated data shape coming from the API. Second, the card's width class was changed from `w-64` (a fixed 256px) to `w-full` (100% of the parent container).

**Why the width change matters:** In the original flat-list layout, a fixed card width was fine because cards wrapped naturally inside a flex container. In the new column layout, each column is a `flex-1` container that grows to fill available space. A fixed-width card inside a fluid column either overflows or creates awkward whitespace. Using `w-full` means the card fills whatever column it sits in, giving the board a consistent, professional appearance regardless of viewport width.

**What was preserved:** The priority-based background color logic (`bg-red-400` for high, `bg-yellow-400` for medium, `bg-green-400` for low) was left entirely untouched. This is a deliberate design choice — color-coding by urgency is a well-understood Kanban convention, and removing it would lose information without adding any.

---

### `src/app/dashboard/page.tsx`

**What changed:** The entire file was rewritten. The previous version was a client component that fetched all tasks and rendered them as a flat, wrapping flex grid of `TaskCard` components. The new version renders a three-column Kanban board powered by `@hello-pangea/dnd`.

**Why `@hello-pangea/dnd`:** The original `react-beautiful-dnd` library, which this package forks from, is no longer maintained and has known compatibility issues with React 18's concurrent mode and React 19's strict mode. `@hello-pangea/dnd` is a community-maintained drop-in replacement with an identical API that is actively kept compatible with modern React. Choosing it now avoids a dependency problem that would surface immediately in this Next.js 16 / React 19 environment.

**How the board is structured:** A constant `COLUMNS` array defines the three columns in order, each with an `id` (matching the status enum values exactly) and a display `label`. The board maps over this array to render a `Droppable` zone per column. Inside each `Droppable`, the tasks array is filtered to only those whose `status` matches the column's `id`, and each matching task is wrapped in a `Draggable`. This approach means there is a single source of truth — the `tasks` state array — and the visual separation into columns is a pure derivation of that state, not a separate data structure. This makes rollbacks and re-renders simple.

**Drag-and-drop persistence and optimistic updates** are covered in detail in the next section.

---

### `src/app/create-task/page.tsx`

**What changed:** Nothing.

**Why:** The form submits `{ title, description, priority }` to `POST /api/tasks`. It does not send a `status` field. Because the Mongoose schema now declares `status` with `default: "todo"`, every new task document written to MongoDB automatically receives `status: "todo"` without the client needing to know about it. This is intentional: the creation form should not expose the status field — a task that has just been created logically belongs in the "To Do" column, and that decision should be enforced at the schema level, not left to the client. Making the schema default do the work keeps the form simple and prevents a class of bugs where a malicious or buggy client could create tasks in an arbitrary state.

---

## 3. How the Kanban Drag-and-Drop Works End to End

When a user picks up a task card and drops it into a different column, the following sequence of events occurs:

**1. The drag begins.** `@hello-pangea/dnd` takes control of the card's position through CSS transforms applied to the `Draggable` wrapper. The library handles all pointer/touch events, scroll compensation, and placeholder insertion (to prevent columns from collapsing as the card lifts out).

**2. The card is dropped.** `DragDropContext`'s `onDragEnd` callback fires with a `DropResult` object. The two key fields are `draggableId` — which is the task's MongoDB `_id` string, used as the `draggableId` prop on each `Draggable` — and `destination.droppableId` — which is the status string of the column the card was dropped into (e.g., `"in-progress"`). If `destination` is `null`, the card was dropped outside any valid column and the function returns early with no state change.

**3. Optimistic update.** Before the network request is made, `setTasks` is called with a mapping that finds the task by `_id` and replaces its `status` with the new value. React re-renders immediately. From the user's perspective the card is already in its new column — there is no waiting for a server round-trip. This is the "optimistic" part: the UI assumes the update will succeed.

**4. The PATCH request is sent.** A `fetch` call goes to `/api/tasks/<task._id>` with method `PATCH` and a JSON body of `{ "status": "in-progress" }` (or whichever column the card was dropped into). The server validates the ID and status, calls `findByIdAndUpdate`, and returns the updated document as JSON with a `200` status.

**5. On success, nothing happens.** The local state already reflects the correct new status. The response body is not used to update state — since the update was optimistic and the server confirmed success, they are in agreement.

**6. On failure, state reverts.** If the response is not `ok`, or if the request throws a network error, the catch block fires a second `setTasks` call that maps over the tasks and restores the original task's `status` (captured in a local variable before the optimistic update). The card visually snaps back to its original column. This gives the user clear feedback that something went wrong without requiring a full page reload.

The key design insight is that `draggableId === task._id` and `droppableId === status enum value`. This one-to-one mapping between library identifiers and data model values means `onDragEnd` can derive everything it needs — which document to update and what to set its status to — directly from the event, with no lookup tables or secondary state required.

---

## 4. Known Limitations / Not Yet Done

**Pre-existing documents without a `status` field.** Any tasks created before this schema migration exist in MongoDB without a `status` field. They will be returned by the `GET /api/tasks` endpoint but will have `status: undefined`, meaning they will not appear in any of the three Kanban columns (since filtering checks for exact equality). A migration script needs to be run once against the database to backfill `status: "todo"` on all documents that are missing it.

**Comments UI.** The `comments` array field exists in the Mongoose schema but there is no API endpoint to add comments, no UI to display them on a card, and no way for users to interact with them. This is purely a schema placeholder for a future feature.

**Activity log UI.** Similarly, the `activityLog` array field is in the schema but has no supporting infrastructure. The intent is to record events like "moved to In Progress by [user] at [time]", but user authentication is not yet implemented, so populating this log meaningfully is blocked.

**No authentication or multi-user support.** All tasks are global. Any user who opens the dashboard can see and modify all tasks. For a club collaboration tool, tasks should be scoped to teams or projects and protected behind authentication. This is the largest architectural gap between the current implementation and a production-ready system.

**No drag-and-drop reordering within a column.** Currently, cards within a column are ordered by MongoDB insertion order and cannot be manually reordered. Implementing intra-column ordering would require adding an `order` field to the schema and updating it on drop, which adds complexity to the PATCH handler and the optimistic update logic.

**README for submission.** The repository README still contains the default Next.js boilerplate. It needs to be updated with setup instructions, environment variable requirements (the MongoDB connection string in `.env.local`), and an explanation of the project's purpose for the recruitment submission.

**Edge case testing.** The PATCH and DELETE endpoints have basic validation but have not been tested against edge cases such as concurrent updates to the same task, extremely long text in title or description fields, or behaviour when the MongoDB connection drops mid-request.
