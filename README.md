# Next.js Application

This project is a **Next.js v14.2.15** application using **TypeScript**,
**Material UI**, **Zustand** for state management, and **Jest** with **React
Testing Library** for unit testing.

## Table of Contents

- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Theming](#theming)
- [State Management](#state-management)
- [Contribution Guidelines](#contribution-guidelines)

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v14 or later)
- npm (or yarn)

### Installation

1. Clone the repository:

   `git clone https://github.com/your-username/your-repo.git`

2. Navigate to the project directory:

   `cd your-repo`

3. Install the dependencies:

   `npm install`

4. Copy the `.env.template`:

   `cp .env.template .env`

5. Start the development server:

   `npm run dev`

The application should now be running at
[http://localhost:3000](http://localhost:3000).

## Folder Structure

This project follows a modular file structure based on Next.js v14's `src/app`
directory layout. Here's an overview:

```bash
src/
├── app/
│   ├── some-page/
│   │   ├── page.tsx       # Corresponds to the URL /some-page
│   │   └── __tests__/
│   │       └── some-page.test.tsx
│   ├── layout.tsx         # Main layout for the application
│   ├── theme.ts           # Material UI theme configuration
│   └── page.tsx           # Homepage (URL: /)
│
├── Components/
│   ├── __tests__/
│   │   └── Header.test.tsx # Unit tests for the Header component
│   └── Header.tsx          # Header component
│
└── store/
    └── useStore.ts         # Zustand store for state management
```

## Running the Project

To start the development server:

`npm run dev`

This will launch the application at
[http://localhost:3000](http://localhost:3000).

To build the application for production:

`npm run build`

To start the production build:

`npm run start`

## Testing

We use **Jest** and **React Testing Library** to test components and application
logic.

### Running Tests

To run all tests:

npm run test

Tests are located in the `__tests__` directories adjacent to the components or
pages they test.

## Theming

This project uses **Material UI** for theming. The theme is configured in the
`src/app/theme.ts` file.

To apply the theme globally in your application, you can use the `ThemeProvider`
component provided by Material UI in your `src/app/layout.tsx` file.

### Applying the Theme

In your `layout.tsx`:

```typescript
// src/app/layout.tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Import your custom theme

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This resets browser default styling */}
      {children}
    </ThemeProvider>
  );
}
```

### Using the Theme in Components

You can access the theme inside any component using Material UI’s `useTheme`
hook or by applying the theme values directly through the MUI components.

Example using `useTheme`:

```typescript
// src/Components/Header.tsx
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const Header = () => {
  const theme = useTheme();

  return (
    <header style={{ backgroundColor: theme.palette.primary.main, padding: '1rem' }}>
      <Typography variant="h4" color="secondary">
        Welcome to the Application
      </Typography>
    </header>
  );
};

export default Header;
```

In this example, the `Header` component uses the primary color from the theme
for the background and the secondary color for the text. You can access any part
of the theme (e.g., spacing, typography) in a similar way with `useTheme`.

---

## State Management

We use **Zustand** for lightweight state management. The store is located in the
`src/store/useStore.ts` file.

Example store setup:

```typescript
// src/store/useStore.ts
import create from "zustand";

interface StoreState {
  counter: number;
  increment: () => void;
}

const useStore = create<StoreState>((set) => ({
  counter: 0,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
}));

export default useStore;
```

## Contribution Guidelines

We encourage all contributors to follow the guidelines outlined in our
[CONTRIBUTING.md](https://github.com/ai-cfia/.github/blob/main/profile/CONTRIBUTING.md)
document.

### Forking and Cloning

1. Fork the repository by clicking on the 'Fork' button on the top-right of the
   repository page.
2. Clone the forked repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

### Working on an Issue

1. Always create a new branch for the feature or bugfix you're working on:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, ensuring they adhere to the
   [CONTRIBUTING.md](https://github.com/ai-cfia/.github/blob/main/profile/CONTRIBUTING.md)
   guidelines.
3. Run the test suite to verify:

   ```bash
   npm run test
   ```

4. Once your changes are complete, commit and push them to your fork:

   ```bash
   git add .
   git commit -m "Description of your feature/bugfix"
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request (PR) from your feature branch, providing a clear
   description of the changes.

### Code Style

- Follow the ESLint and Prettier configurations provided.
- Write unit tests for your code.
- Ensure the app runs without errors before submitting.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.
