# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional dental clinic website for Dr. Genchev's dental implantology practice. Static frontend served via Netlify, with Node.js serverless functions powering an AI chatbot, patient data storage, and Telegram notifications to the dentist.

## Commands

```bash
npm run dev          # Start local dev server (netlify dev — serves functions + static)
npm run deploy       # Deploy to production (netlify deploy --prod)
npm run test:health  # Run health check function test (scripts/test-health-check.js)
```

There is no build step — the site is static HTML/CSS/JS served directly.

## Architecture

### Frontend
- `index.html` — single-page site with all sections (hero, services, testimonials, FAQ, contact)
- `css/style.css` — all styles; responsive breakpoints at 768px (tablet) and 1200px (desktop)
- `js/script.js` — all frontend logic: chat UI, form handling, language switching, animations
- `js/translations/{en,bg,ru}.json` — i18n strings; language is auto-detected from browser

### Serverless Functions (`netlify/functions/`)
- `ai-chat-enhanced.js` — primary chatbot endpoint; validates with Zod, builds conversation context, calls OpenAI, stores encrypted history, fires async Telegram notification
- `ai-chat.js` — legacy chatbot endpoint (superseded by `ai-chat-enhanced.js`)
- `telegram-notify.js` — sends Telegram messages to the dentist
- `telegram-webhook.js` — receives Telegram messages from dentist (webhook-based)
- `upload-xray.js` — handles patient X-ray image uploads
- `daily-summary.js` — scheduled at 3 PM UTC; sends daily patient summary via Telegram
- `health-check.js` — scheduled at 6 AM UTC; verifies DB, OpenAI, and Telegram are reachable

### Shared Libraries (`lib/`)
| File | Purpose |
|------|---------|
| `supabase-client.js` | All Supabase DB operations |
| `openai-client.js` | GPT-4 calls + system prompt |
| `telegram-client.js` | Telegram Bot API wrapper |
| `encryption-utils.js` | AES-256 encrypt/decrypt for patient data |
| `gdpr-utils.js` | 30-day auto-deletion, audit logging |

### Database (Supabase / PostgreSQL)
Five tables: `conversations`, `messages`, `patient_info`, `audit_logs`, `file_uploads`. All patient-identifying fields are AES-256 encrypted at the application layer before storage. Conversations expire after 30 days (GDPR).

### Chat Flow
1. User submits message → `POST /api/ai-chat-enhanced`
2. Function validates input (Zod), retrieves conversation history from Supabase
3. Calls GPT-4 with full context + system prompt
4. Stores encrypted message pair in Supabase
5. Fires async Telegram notification (non-blocking)
6. Returns AI response to frontend

### Scheduled Tasks
Defined in `netlify.toml`:
- `health-check`: `0 6 * * *` (6 AM UTC = ~8–9 AM Bulgarian time)
- `daily-summary`: `0 15 * * *` (3 PM UTC = ~5–6 PM Bulgarian time)

## Key Configuration

**`netlify.toml`** — publish dir, function dir, security headers, scheduled function cron expressions.

**Environment variables** (see `env.example`):
```
OPENAI_API_KEY          # GPT-4 access
TELEGRAM_BOT_TOKEN      # Bot token for dentist notifications
TELEGRAM_CHAT_ID        # Dentist's Telegram ID
SUPABASE_URL / SUPABASE_ANON_KEY
WEBHOOK_SECRET          # 32-byte secret for request validation
ENCRYPTION_KEY          # 32-byte AES-256 key for patient data
SITE_URL
NODE_ENV
```
In local dev these live in `.env`; in production they are set in the Netlify dashboard.

## Utility Scripts (`scripts/`)

- `setup-webhook.sh` / `configure-webhook.sh` / `verify-webhook.sh` — Telegram webhook management
- `view-conversation.js` — decrypt and print a conversation from the DB for debugging
- `deploy.sh` — automated deployment helper

## Documentation

`docs/` contains detailed setup guides for each integration (Supabase, Telegram, OpenAI), deployment guides, and phase-by-phase development history. Check there before re-implementing something that may already be documented.
