FROM node:22 AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

FROM node:alpine AS main
COPY --from=build /app /
EXPOSE 4000
CMD ["npm", "start"]