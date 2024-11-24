### ForgeTelegramApp
A basic boilerplate, containing all the requirements to build and ship Telegram web apps on top of Cloudflare Workers.

Warning: This project is not production-ready and is only meant to be used as a starting point for building Telegram web apps.

## Backend
- [Hono](https://hono.dev/) for API routing
- [Drizzle](https://orm.drizzle.team/) for database
- [Zod](https://zod.dev/) for data validation
- [Trpc](https://trpc.io/) for API
- [Neon](https://neon.tech/) for Postgres
- [Vitest](https://vitest.dev/) for testing

### How to run for development

```bash
pnpm install
pnpm run dev
```

### Deploying to production

```bash
pnpm deploy
```

### Testing

```bash
pnpm test {test-name?}
```

---

## Frontend
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn](https://ui.shadcn.com/)
- [Tanstack Query](https://tanstack.com/query)
- [Tanstack Router](https://tanstack.com/router)
- [Telegram Web Apps](https://core.telegram.org/bots/webapps)

### How to run for development
In order to run and preview the frontend, you need to spin up ngrok so that you can directly view the web app in Telegram.

```bash
pnpm install
pnpm run dev
```

You also need to send `/test {ngrok-url}` to the bot, in order to get the web app url.

---

### Telegram Bot
A basic implementation of a Telegram bot using Hono as the backend router.

- [Hono](https://hono.dev/) for API routing
- [Telegram Bot](https://core.telegram.org/bots)

