FROM node:18-slim

# Drop privileges
USER node

# Set NPM global dependency path
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy app source
COPY . .

# Assume production environment
ENV NODE_ENV=deployment

# Volume for upload
VOLUME [ "/app/public/uploads" ] 

EXPOSE 80

ENTRYPOINT [ "npm", "start" ]