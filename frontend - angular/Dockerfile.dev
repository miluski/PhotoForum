FROM node:23-alpine

WORKDIR /app

COPY . .

RUN rm -rf node_modules package-lock.json

RUN npm install -g @angular/cli

RUN npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]