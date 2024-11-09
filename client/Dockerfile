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

COPY nginx/lams.app /etc/nginx/sites-available/


RUN mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled /var/www/lams.app

COPY --from=builder  /build/dist/ /var/www/lams.app

# Enable the site by creating a symlink in sites-enabled
RUN ln -s /etc/nginx/sites-available/lams.app /etc/nginx/sites-enabled/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# FROM measri/lighttpd:1.4.72 AS runner

# COPY lighttpd/*.conf /etc/lighttpd/conf.d/

# COPY --from=builder /build/dist /var/www/htdocs