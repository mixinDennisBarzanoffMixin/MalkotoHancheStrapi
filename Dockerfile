FROM node:22

WORKDIR /srv/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install better-sqlite3 --save

# Copy application files
COPY . .

EXPOSE 1337

RUN npm run build

CMD ["npm", "run", "start"] 