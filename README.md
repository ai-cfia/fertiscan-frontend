# Fertiscan Frontend

## Running the App Using Docker

- For local testing, build the Docker image with default values: `docker build
  -t fertiscan-frontend .`

- Production build:

```sh
docker build \
  --build-arg ARG_API_URL=http://your_api_url \
  --build-arg ARG_REACT_APP_ACTIVATE_USING_JSON=false \
  --build-arg ARG_REACT_APP_STATE_OBJECT_SIZE_LIMIT=4194304 \
  -t fertiscan-frontend .
```

- Run the image (on port 3001 for example): `docker run -p 3001:3000
  fertiscan-frontend`
