# Fertiscan Frontend

## Available Scripts

In the project directory, you can run:

- `npm run dev`

  Starts the development server. Open `localhost:5173` to view it in your
  browser. The app will automatically reload if you make changes to the code.
  You will see build errors and lint warnings in the console.

- `npm run dev:host`

  Starts the development server and makes it accessible over your local network.

- `npm run build`

  Compiles TypeScript and builds the app for production to the `dist` folder. It
  correctly bundles React in production mode and optimizes the build for the
  best performance. Your app is ready to be deployed!

- `npm run lint`

  Runs ESLint to find problems in your code.

- `npm run lint:fix`

  Runs ESLint to find and fix problems in your code automatically.

- `npm run preview`

  Locally previews the production build.

- `npm run test`

  Launches the test runner.

- `npm run test:watch`

  Launches the test runner in interactive watch mode.

- `npm run test:coverage`

  Runs tests and generates a coverage report.

## Running the App Using Docker

- For local testing, build the Docker image with default values: `docker build
-t fertiscan-frontend .`

- Production build:

```sh
docker build -t fertiscan-frontend .
```

- Run the image (on port 3001 for example): `docker run -p 3001:3000
fertiscan-frontend`
