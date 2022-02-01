
# Get package from docker-hub
FROM node:17-buster as base

# Set our working directory to /code
WORKDIR /code

# Copy package.json and package-lock.json into working directory /code
COPY package.json package.json
COPY package-lock.json package-lock.json

# Install packages 
RUN npm install

FROM base as test
RUN npm ci
COPY . .
RUN npm run test

# # Copy all files from local directory into /code directory
# COPY . . 

# Docker runs this command 
FROM base as prod
RUN npm ci --production
COPY . .
WORKDIR /code/my-app
CMD ["npm", "run", "start"]

