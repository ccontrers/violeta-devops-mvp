FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]
