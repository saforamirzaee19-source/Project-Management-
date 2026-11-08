# Forma

Forma is a small React project-management demo built with Vite and Tailwind CSS.

## Run locally

Install dependencies:

```sh
npm install
```

Start the mock API in one terminal:

```sh
npm run dev:api
```

Start the app in another terminal:

```sh
npm run dev
```

The dashboard fetches tasks from `/api/tasks`. Vite proxies that request to the
JSON Server running at `http://localhost:3001/tasks`. The sample data is in
`db.json`. API data is fetched and mutations are managed with TanStack React
Query. A browser-specific user ID is generated once and saved in local storage;
new projects use it for both `owner` and `createdBy`.
Project, task, and sign-in form inputs are validated with Zod before submission.
Open a project from the projects page to view its details and related tasks at
`/project/:id`.

This local user ID is only a demo identity, not authentication. Clearing the
browser's local storage creates a new ID.

## Other commands

- `npm run lint` checks the source files.
- `npm run build` creates the production build.
