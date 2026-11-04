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
`db.json`.

## Other commands

- `npm run lint` checks the source files.
- `npm run build` creates the production build.
