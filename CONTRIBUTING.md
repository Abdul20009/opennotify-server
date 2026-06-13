# Contributing to OpenNotify

Thanks for your interest in contributing to OpenNotify! This project is small but growing, and contributions of any size are welcome — bug fixes, new features, documentation improvements, or just opening issues to discuss ideas.

---

## Ways to Contribute

- 🐛 **Report bugs** — open an issue describing what happened, what you expected, and steps to reproduce
- 💡 **Suggest features** — open an issue with the `enhancement` label
- 📝 **Improve documentation** — typos, unclear setup steps, missing examples
- 🔧 **Submit code** — bug fixes, new endpoints, SDK improvements

---

## Project Structure

This project is split across two repositories:

- [`opennotify-server`](https://github.com/Abdul20009/opennotify-server) — Node.js backend (Express, Socket.io, PostgreSQL, Redis)
- [`opennotify_flutter`](https://github.com/Abdul20009/opennotify_flutter) — Flutter/Dart client SDK

Make sure you're contributing to the right repo for your change.

---

## Local Development Setup

### Server

1. Fork and clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your own Supabase + Upstash credentials (free tiers work fine — see the main README for setup)
4. Run the SQL in `README.md` against your Supabase project to create the required tables
5. Start the dev server:
   ```bash
   npm run dev
   ```

### Flutter SDK

1. Fork and clone `opennotify_flutter`
2. Run:
   ```bash
   flutter pub get
   ```
3. To test changes against a real server, use the `path:` dependency override in a separate test app:
   ```yaml
   dependencies:
     opennotify_flutter:
       path: ../opennotify_flutter
   ```

---

## Making Changes

1. Create a new branch:
   ```bash
   git checkout -b fix/short-description
   ```
2. Make your changes, following the existing code style
3. Test your changes locally (run the server + a test client, or `flutter analyze` for the SDK)
4. Commit with a clear message:
   ```bash
   git commit -m "Fix: handle disconnect when socket id is null"
   ```
5. Push your branch and open a Pull Request against `main`

---

## Pull Request Guidelines

- Keep PRs focused — one fix or feature per PR is easier to review
- Describe **what** changed and **why** in the PR description
- If your change affects the API (new routes, changed response shapes), update the README
- If your change affects the Flutter SDK's public API, update its README and bump the version in `pubspec.yaml` following [semantic versioning](https://semver.org/)

---

## Code Style

- **Server (Node.js):** plain JavaScript, CommonJS (`require`/`module.exports`), raw SQL via `pg` (no ORM)
- **Flutter SDK:** standard Dart conventions, run `flutter analyze` before submitting — aim for zero issues

---

## Questions?

Open an issue with the `question` label — happy to help, especially if you're new to open source contributions.