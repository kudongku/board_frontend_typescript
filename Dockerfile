FROM node:18 AS base
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18 AS runner
WORKDIR /app

COPY --from=base /app ./

EXPOSE 3000

CMD ["npm", "start"]
