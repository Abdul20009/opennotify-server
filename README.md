# OpenNotify

**Self-hosted, real-time in-app notifications — free, open source, and Flutter-first.**

OpenNotify lets you add real-time notifications to your Flutter app without relying on paid services like OneSignal or Firebase Cloud Messaging. Run your own notification server in minutes, and connect your Flutter app with a simple SDK.

---

## Features

- 🔴 **Real-time delivery** via WebSockets (Socket.io) — notifications arrive instantly, no polling
- 🗄️ **PostgreSQL storage** — every notification is saved and queryable
- 🟢 **Online presence tracking** via Redis (Upstash) — know which users are currently connected
- 📱 **Flutter SDK** — `opennotify_flutter` package for instant integration
- 🐳 **Docker-ready** — self-host in one command
- 🆓 **Free to run** — built entirely on free tiers (Supabase + Upstash)

---

## Architecture

```
Flutter App  ──▶  OpenNotify Server (Node.js + Express + Socket.io)
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
          PostgreSQL           Redis (Upstash)
          (Supabase)            (presence)
```

---

## Quick Start (Self-Hosting)

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed
- A free [Supabase](https://supabase.com) project (PostgreSQL database)
- A free [Upstash](https://upstash.com) Redis database

### 1. Clone the repo

```bash
git clone https://github.com/Abdul20009/opennotify-server.git
cd opennotify-server
```

### 2. Set up your database

In your Supabase project, open the **SQL Editor** and run:

```sql
CREATE TABLE apps (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  app_id TEXT NOT NULL REFERENCES apps(id),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_app_id ON notifications(app_id);
```

> **Note:** Use the **Session Pooler** connection string from Supabase (Settings → Database) if you're on an IPv4-only network — the direct connection requires IPv6.

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://postgres.xxxx:yourpassword@aws-x-xx-xxxx-x.pooler.supabase.com:5432/postgres?sslmode=require"
PORT=3000
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

### 4. Run with Docker

```bash
docker compose up --build
```

Your server is now running at `http://localhost:3000`.

### 5. Register your app

Run this in Supabase SQL Editor to get an App ID:

```sql
INSERT INTO apps (name) VALUES ('My App') RETURNING *;
```

Copy the returned `id` — you'll use this as `appId` when sending notifications.

---

## API Reference

### Send a notification

```http
POST /notifications
Content-Type: application/json

{
  "appId": "your-app-id",
  "userId": "user_123",
  "title": "New message",
  "body": "You have a new message from Sarah",
  "data": { "screen": "chat", "chatId": "abc123" }
}
```

If `user_123` is currently connected, the notification is delivered instantly via WebSocket. It's also saved to the database either way.

### Get notifications for a user

```http
GET /notifications/:userId
```

### Mark a notification as read

```http
PATCH /notifications/:id/read
```

### Check if a user is online

```http
GET /presence/:userId
```

Returns:

```json
{ "userId": "user_123", "online": true }
```

---

## Flutter SDK

Add to your `pubspec.yaml`:

```yaml
dependencies:
  opennotify_flutter:
    git:
      url: https://github.com/Abdul20009/opennotify_flutter.git
```

Usage:

```dart
import 'package:opennotify_flutter/opennotify_flutter.dart';

final client = OpenNotifyClient(
  serverUrl: 'http://your-server-url.com',
  userId: 'user_123',
);

client.onNotification((notification) {
  print('${notification.title}: ${notification.body}');
});

client.connect();
```

> **Android:** Add `android:usesCleartextTraffic="true"` to your `AndroidManifest.xml` `<application>` tag if your server uses plain HTTP, and ensure `android.permission.INTERNET` is declared.

---

## Why OpenNotify?

| | OpenNotify | Firebase/OneSignal |
|---|---|---|
| Cost | Free, self-hosted | Free tier limits, paid scaling |
| Data ownership | Yours | Third-party |
| Flutter SDK | First-class | Generic/limited |
| Customization | Full source access | Limited |

---

## Tech Stack

- **Backend:** Node.js, Express, Socket.io
- **Database:** PostgreSQL (via Supabase or any Postgres instance)
- **Cache/Presence:** Redis (via Upstash or any Redis instance)
- **Mobile SDK:** Flutter / Dart

---

## Contributing

This project is open source and contributions are welcome — issues, PRs, and feature suggestions all appreciated.

## License

MIT