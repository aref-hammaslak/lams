FROM node:18-slim AS builder

# Set working directory
WORKDIR /build

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy app source
COPY . .

# Build app
RUN npm run build


FROM nginx

COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY nginx/lams.app.template /etc/nginx/sites-available/


RUN mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled /var/www/lams.app

COPY --from=builder  /build/dist/ /var/www/lams.app

# Enable the site by creating a symlink in sites-enabled
RUN ln -s /etc/nginx/sites-available/lams.app /etc/nginx/sites-enabled

EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '${APP_PORT} ${API_URL}' < /etc/nginx/sites-available/lams.app.template > /etc/nginx/sites-available/lams.app && rm /etc/nginx/sites-available/lams.app.template && nginx -g 'daemon off;'"]
