# Forma

Forma is a small React project-management demo built with Vite and Tailwind CSS.

## Run locally

Install dependencies:

```sh
npm install
```

Start the app and mock API together:

```sh
npm run dev
```

The dashboard fetches tasks from `/api/tasks`. Vite proxies that request to the
JSON Server running at `http://localhost:3001/tasks`. The development command
starts JSON Server from `db.json` automatically, reuses it if it is already
running, and stops both servers when the command exits. API data is fetched and
mutations are managed with TanStack React Query. A browser-specific user ID is
generated once and saved in local storage; new projects use it for both `owner`
and `createdBy`.
Project, task, and sign-in form inputs are validated with Zod before submission.
Open a project from the projects page to view its details and related tasks at
`/project/:id`.

The sign-in form creates a browser-local demo session managed with React
Context. React Router protects the dashboard, tasks, projects, and project
detail routes, and restores the requested route after sign-in. This demo does
not verify credentials or provide secure authentication; use a backend auth
service for real accounts. Signing out clears the session, while the demo user
ID remains in local storage for project/task ownership display.

## Other commands

- `npm run lint` checks the source files.
- `npm run build` creates the production build.
