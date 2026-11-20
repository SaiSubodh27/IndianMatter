# Multi-stage build for IndianMatter Vite React Frontend

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for Vite compilation
ARG VITE_API_BASE_URL=http://localhost:8000
ARG VITE_TOPATH_URL=http://localhost:8000
ARG VITE_SUPABASE_URL=https://oyqjwtkaivigwwgiqxco.supabase.co
ARG VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cWp3dGthaXZpZ3d3Z2lxeGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MzE0NDQsImV4cCI6MjEwNzAwNzQ0NH0.w8ocUueTKZdTNoMy93_kztACxlCDvFSIBCbroX-LfyA

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TOPATH_URL=$VITE_TOPATH_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Configure Nginx SPA fallback for client-side routing
RUN printf 'server {\n\
    listen 5173;\n\
    server_name localhost;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]

