FROM node:20.12.2-alpine AS build

ARG ARG_VITE_APP_ACTIVATE_USING_JSON
ARG ARG_VITE_API_URL
ARG VITE_APP_STATE_OBJECT_SIZE_LIMIT

ENV VITE_APP_ACTIVATE_USING_JSON=${ARG_VITE_APP_ACTIVATE_USING_JSON:-false}
ENV VITE_API_URL=${ARG_VITE_API_URL:-/api}
ENV VITE_APP_STATE_OBJECT_SIZE_LIMIT=${VITE_APP_STATE_OBJECT_SIZE_LIMIT:-4194304}

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
COPY $env_filename ./.env.production

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
