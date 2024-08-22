FROM node:20.12.2-alpine AS build

ARG env_filename=.env.production

WORKDIR /code

# Define build arguments
ARG ARG_API_URL
ARG ARG_REACT_APP_ACTIVATE_USING_JSON
ARG ARG_REACT_APP_STATE_OBJECT_SIZE_LIMIT

# Copy files
COPY ./src ./src
COPY ./public ./public
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .
COPY index.html .
COPY $env_filename ./.env.production

# Set environment variables based on build arguments
ENV REACT_APP_ACTIVATE_USING_JSON=${ARG_REACT_APP_ACTIVATE_USING_JSON:-true}
ENV API_URL=${ARG_API_URL:-http://127.0.0.1:5000}
ENV REACT_APP_STATE_OBJECT_SIZE_LIMIT=${ARG_REACT_APP_STATE_OBJECT_SIZE_LIMIT:-4194304}

# Install npm at a specific version, dependencies, build, and run tests
RUN npm install --include=dev
RUN npm run build

# Setup for production
FROM node:20.12.2-alpine AS runtime

RUN getent group fertiscangroup || addgroup -S fertiscangroup && \
    id -u fertiscanuser &>/dev/null || adduser -S fertiscanuser -G fertiscangroup

# Install serve globally
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy build artifacts from the build stage
COPY --from=build /code/dist /app

EXPOSE 3000

RUN chown -R fertiscanuser:fertiscangroup /app

USER fertiscanuser

# Serve your app
ENTRYPOINT ["serve", "-s", "/app"]
