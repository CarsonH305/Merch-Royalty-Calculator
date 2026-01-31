# Deployment Guide

## Frontend (S3 + CloudFront)

1. Build: `nx run royalty-calculator:build --configuration=production`
2. Output: `dist/apps/royalty-calculator/browser`
3. Deploy to S3: `aws s3 sync dist/apps/royalty-calculator/browser s3://YOUR_BUCKET/royalty-calculator --delete`
4. Invalidate CloudFront: `aws cloudfront create-invalidation --distribution-id ID --paths "/royalty-calculator/*"`

## API (NestJS)

### Option A: AWS App Runner

1. Build: `nx run royalty-calculator-api:build`
2. Create a Dockerfile that runs the compiled output
3. Push to ECR and create App Runner service

### Option B: EC2 / ECS

1. Build: `nx run royalty-calculator-api:build`
2. Run: `node dist/apps/royalty-calculator-api/main.js`
3. Set `MONGODB_URI` and `PORT` env vars

### Option C: Serverless (Lambda)

Wrap the NestJS app with `@vendia/serverless-express` and deploy via Serverless Framework. See NestJS serverless documentation.

## Environment

- `MONGODB_URI`: MongoDB connection string (Atlas or self-hosted)
- `PORT`: API port (default 3333)

## Frontend API URL

Set `environment.apiUrl` in production to your API base URL (e.g. `https://api.example.com`).
