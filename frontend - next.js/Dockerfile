FROM node:alpine AS build

WORKDIR /app

COPY . .

RUN rm -rf node_modules package-lock.json

RUN npm install

RUN npm run build

FROM node:alpine

WORKDIR /app

RUN apk add --no-cache nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/next.config.ts ./
COPY --from=build /app/.next /app/.next
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules

CMD ["sh", "-c", "npm run start & nginx -g 'daemon off;'"]