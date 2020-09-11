FROM node:14.10.1-slim
WORKDIR /app
COPY server.js package*.json ./
RUN npm install --only=production
EXPOSE 3001
CMD [ "npm", "start" ]
