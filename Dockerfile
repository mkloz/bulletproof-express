FROM node:18.16.1 AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i
COPY . .
RUN npm run build

FROM node:18-alpine AS store
WORKDIR /app
COPY . .
COPY --from=builder /app/dist ./dist
RUN npm install --omit=dev && apk --no-cache add curl && npx prisma generate
