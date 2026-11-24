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

The app uses the Next.js App Router, Next.js route handlers, and NextAuth
credentials authentication. Account records and project/task data are stored
in `db.json`; passwords are salted and hashed with PBKDF2. Protected pages and
API reads require an authenticated session. Project, task, and sign-in form
inputs are validated with Zod. Open a project from the projects page to view
its details and related tasks at `/project/:id`.

Users can create an account, sign in, and update their name, email, or password
from `/account`. New accounts are always regular users. To bootstrap the first
administrator, register the account, stop the development server, and set that
account's `"role"` to `"admin"` in the `accounts` array in `db.json`. After
restarting the app, administrators can grant or remove administrator access at
`/admin`. Role changes are checked on the server; users cannot change their own
role, and the last administrator cannot be demoted.

## Other commands

- `npm run lint` checks the source files.
- `npm run build` creates the production build.
