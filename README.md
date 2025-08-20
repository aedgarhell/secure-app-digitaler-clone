# Secure App Digitaler Clone - Notfall-Freigabe & Nachfolge

This repository contains the source code for the "Notfall-Freigabe & Nachfolge" application (a digital clone for handling emergency release of client secrets and company succession).

## Overview

This project provides a Docker-based, multi-tenant, secure system allowing managed clients to access crucial infrastructure information (secrets, documentation, runbooks) in the event of the administrator’s death or unavailability. It includes features like:

- Heartbeat/Dead-Man’s-Switch with grace periods and trustees
- Strong authentication for clients (2FA/WebAuthn)
- Secure storage of secrets (envelope encryption with KMS/HSM)
- Runbook and documentation management
- Audit logging and compliance
- Optional firm succession module (questionnaires, leads)

Refer to `/docs` (to be created) for detailed architecture and design.

## Quickstart (Development)

1. Install dependencies (requires pnpm):  
   ```bash
   pnpm install
   ```

2. Copy the example env file and generate secrets:
   ```bash
   cp .env.example .env
   mkdir -p secrets
   openssl rand -hex 32 > secrets/master_key.txt
   openssl rand -hex 32 > secrets/jwt_secret.txt
   ```

3. Start the stack using Docker Compose:
   ```bash
   docker compose up -d --build
   ```

4. Run migrations (via Prisma):
   ```bash
   docker compose exec api npx prisma migrate dev --name init
   ```

5. (Optional) Seed a demo tenant/user:
   ```bash
   docker compose exec api node apps/api/dist/scripts/seed.js
   ```

For more details on local development and architecture, see the `/docs` directory (coming soon).
