FROM node:22-alpine AS build
WORKDIR /app
# Chromium fica só neste estágio: a imagem final continua nginx:alpine, sem navegador.
RUN apk add --no-cache chromium
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm run prerender

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
