FROM node:20-alpine
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "node", "dist/server.js" ]