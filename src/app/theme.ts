'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'var(--font-roboto)',
    },
    cssVariables: true,
    palette: {
        mode: 'light',
        primary: {
            main: '#3f6d93',
        },
        secondary: {
            main: '#dc004e',
        },
    }
});

export default theme;
