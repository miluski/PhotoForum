FROM node:alpine AS build

WORKDIR /app

COPY . .

RUN rm -rf package-lock.json node_modules

RUN npm install -g @angular/cli --latest

RUN npm install

RUN ng build --configuration production --verbose

FROM node:alpine

RUN apk add --no-cache nginx

COPY --from=build /app/dist/photo-forum/browser /usr/share/nginx/html
COPY --from=build /app/dist/photo-forum/server /app/server
COPY --from=build /app/dist/photo-forum/browser /dist/frontend/browser

COPY nginx.conf /etc/nginx/nginx.conf

CMD ["sh", "-c", "node /app/server/main.server.mjs && nginx -g 'daemon off;'"]