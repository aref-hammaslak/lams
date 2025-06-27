ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-slim

ARG NPM_MIRROR=https://registry.npmmirror.com
ENV NPM_CONFIG_REGISTRY=${NPM_MIRROR}
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV NODE_ENV=production

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && \
    npm install -g pm2 && \
    chown -R node:node /app

COPY . .
USER node
ENTRYPOINT ["pm2-runtime", "start", "npm", "--", "start"]