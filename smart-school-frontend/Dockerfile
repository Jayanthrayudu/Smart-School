# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY .env ./
COPY . .

# Build frontend
RUN npm run build \
  && echo "Frontend build completed. Open: http://localhost:3000"

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD echo "Frontend running at: http://localhost:3000" && nginx -g "daemon off;"
