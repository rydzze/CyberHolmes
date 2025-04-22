FROM node:22.14.0 AS build

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install --legacy-peer-deps

COPY frontend/.env .env

COPY frontend/ .

RUN npm run build


FROM node:22.14.0-slim AS production

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000

CMD ["npm", "start"]
