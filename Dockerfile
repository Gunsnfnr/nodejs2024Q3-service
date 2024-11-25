FROM node:18 AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npx prisma generate

FROM node:alpine AS main
WORKDIR /app
COPY --from=build /app /app
EXPOSE ${PORT}
CMD ["npm", "start"]
