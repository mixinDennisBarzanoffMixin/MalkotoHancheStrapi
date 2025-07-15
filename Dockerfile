FROM node:22

WORKDIR /srv/app

# Copy only package files first — this is the most cacheable layer
COPY package*.json ./

# Install ALL dependencies in one step
RUN npm install

# Now copy the rest of your app
COPY . .

# Expose port
EXPOSE 1337

# Build the project
RUN npm run build

# Start the app
CMD ["npm", "run", "start"]
