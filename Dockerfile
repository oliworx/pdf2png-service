FROM node:12.6.0-slim
WORKDIR /app
COPY server.js package*.json ./
RUN npm install --only=production
EXPOSE 3001
CMD [ "npm", "start" ]
