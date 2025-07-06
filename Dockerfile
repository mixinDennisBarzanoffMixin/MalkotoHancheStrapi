FROM node:18-alpine

WORKDIR /srv/app

# Install build dependencies
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

# Copy package files
COPY strapi-cloud-template-blog-4ca0014f37/package*.json ./

# Install dependencies
RUN npm install
RUN npm install better-sqlite3 --save

# Copy application files
COPY strapi-cloud-template-blog-4ca0014f37 .

# Ensure .env is copied
COPY strapi-cloud-template-blog-4ca0014f37/.env ./.env

EXPOSE 1337

CMD ["npm", "run", "develop"] 