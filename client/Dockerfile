FROM node:18-slim AS builder

# Set working directory
WORKDIR /build

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Build app
RUN npm run build

FROM measri/lighttpd:1.4.72 AS runner

COPY lighttpd/*.conf /etc/lighttpd/conf.d/

COPY --from=builder /build/dist /var/www/htdocs