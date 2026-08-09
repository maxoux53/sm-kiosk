FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma ./prisma

RUN npm i

COPY . .

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ARG DATABASE_URL="postgresql://user:password@localhost:5432/db"
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate

RUN npm run genDoc
RUN npm run build

EXPOSE 3001

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "run", "start"]