FROM node:22 AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npx prisma generate

FROM node:alpine AS main
COPY --from=build /app /
EXPOSE ${PORT}
CMD ["npm", "start"]
