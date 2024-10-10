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
            main: '#05486C',
        },
        secondary: {
            main: '#dc004e',
        },
    }
});

export default theme;
