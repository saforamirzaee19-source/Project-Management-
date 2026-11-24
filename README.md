# Forma

Forma is a small React project-management demo built with Next.js App Router
and Tailwind CSS.

## Run locally

Install dependencies:

```sh
npm install
```

Start the app:

```sh
npm run dev
```

The app uses Next.js API route handlers for projects and tasks. The API reads
and writes `db.json` on the server, and the development command starts only
Next.js. API data is fetched and mutations are managed with TanStack React
Query. Each account has a stable user ID used for project and task ownership.
Project, task, and sign-in form inputs are validated with Zod before submission.
Open a project from the projects page to view its details and related tasks at
`/project/:id`.

Users can create an account, sign in with its credentials, and update their
name, email, or password from `/account`. React Context manages the browser
session, and React Router protects workspace and account routes. The demo keeps
accounts and sessions in browser local storage and hashes passwords with
PBKDF2; it is not a substitute for server-side authentication or authorization.
Use a backend auth service for production accounts.

## Other commands

- `npm run lint` checks the source files.
- `npm run build` creates the production build.
