ARG NODE_VERSION=18
ARG NGINX_VERSION=1.26

FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /build
COPY package*.json ./

ARG NPM_MIRROR=https://registry.npmmirror.com
RUN npm config set registry ${NPM_MIRROR}
RUN npm install --force

COPY . .
RUN npm run build

FROM nginx:${NGINX_VERSION}-alpine

RUN mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled /var/www/lams.app
COPY --from=builder /build/dist/ /var/www/lams.app
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/template.conf /app/template.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

ENV WORKDIR=/app
WORKDIR ${WORKDIR}
ENV PATH_SITE_AVAILABLE=/etc/nginx/sites-available
ENV PATH_SITE_ENABLED=/etc/nginx/sites-enabled
ENV APP_HOST=localhost
ENV APP_PORT=80
ENV API_URL=http://localhost:3001

RUN chmod +x /docker-entrypoint.sh
RUN chown -R nginx:nginx \
    /etc/nginx/sites-available \
    /etc/nginx/sites-enabled \
    /docker-entrypoint.sh \
    /var/*
RUN touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

USER nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
