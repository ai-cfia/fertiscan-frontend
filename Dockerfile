FROM node:20.12.2-alpine AS build

WORKDIR /code

# Copy files
COPY ./src ./src
COPY ./public ./public
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .
COPY index.html .

# Install npm at a specific version, dependencies, build, and run tests
RUN npm install --include=dev
RUN npm run build

# Setup for production
FROM node:20.12.2-alpine AS runtime

# Install serve globally
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy build artifacts from the build stage
COPY --from=build /code/dist /app

EXPOSE 3000

# Serve your app
ENTRYPOINT ["serve", "-s", "/app"]