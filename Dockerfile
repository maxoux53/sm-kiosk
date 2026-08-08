FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma ./prisma

RUN npm i

COPY . .

ARG DATABASE_URL="postgresql://user:password@localhost:5432/db"
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate

RUN npm run genDoc
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]