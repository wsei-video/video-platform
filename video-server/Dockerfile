FROM node:24-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .

ARG APP_NAME
RUN npm run build -- ${APP_NAME}

EXPOSE 3000
CMD ["node", "dist/apps/${APP_NAME}/main"]
