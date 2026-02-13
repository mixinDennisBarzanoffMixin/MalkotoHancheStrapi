# Railway Deployment Setup

## Required Variables (Strapi service)

Set these in Railway → Strapi service → Variables:

| Variable | Source | Notes |
|----------|--------|-------|
| `DATABASE_URL` | Reference: `${{Postgres.DATABASE_URL}}` | Link Postgres service; Railway substitutes this |
| `DATABASE_CLIENT` | `postgres` | |
| `PUBLIC_URL` | `https://admin.malkotohanche.com` | Your Strapi admin domain (or Railway URL) |
| `APP_KEYS` | Your keys | Comma-separated, e.g. `key1,key2` |
| `API_TOKEN_SALT` | Your salt | |
| `ADMIN_JWT_SECRET` | Your secret | |
| `JWT_SECRET` | Your secret | |
| `TRANSFER_TOKEN_SALT` | Your salt | |
| `HOST` | `0.0.0.0` | Required for Railway |
| `PORT` | `1337` | Railway sets this automatically |
| `NODE_ENV` | `production` | |

### MinIO / S3 (for uploads)

| Variable | Source | Notes |
|----------|--------|-------|
| `S3_ENDPOINT` | Reference: `${{Bucket.MINIO_PUBLIC_ENDPOINT}}` or `https://bucket-production-7b3d.up.railway.app` | |
| `S3_ACCESS_KEY` | From Bucket service | |
| `S3_ACCESS_SECRET` | From Bucket service | |
| `S3_BUCKET` | `images` | |
| `S3_REGION` | `any` | |

### Optional (email, Twilio, etc.)

Copy from your local `.env` as needed.

## Service Links

1. **Postgres** → Strapi: Add Postgres as a dependency; reference `${{Postgres.DATABASE_URL}}`
2. **Bucket (MinIO)** → Strapi: Add Bucket as a dependency; reference `${{Bucket.MINIO_PUBLIC_ENDPOINT}}` for S3_ENDPOINT

## Deploy

Push to your connected GitHub repo, or run:

```bash
railway up
```
