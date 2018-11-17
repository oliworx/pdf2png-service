FROM node:10.13
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY server.js ./
EXPOSE 3001
CMD [ "npm", "start" ]

