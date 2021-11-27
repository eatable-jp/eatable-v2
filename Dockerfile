FROM node:14.17.3-buster

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "serve"]