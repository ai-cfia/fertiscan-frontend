"use client";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Header from "@/Components/Header";
import SideNav from "@/Components/Sidenav";
import {useState} from "react";

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});


export default function RootLayout({children}: Readonly<{ children: React.ReactNode;}>) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        console.log("aaaa")
        setMobileOpen(!mobileOpen);
        console.log(mobileOpen);
    };
    return (
        <html lang="en">
        <body className={roboto.variable}>
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <Header handleDrawerToggle={handleDrawerToggle}/>
                <SideNav mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}/>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}