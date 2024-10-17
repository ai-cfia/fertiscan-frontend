import * as React from 'react';
import Link from 'next/link';
import {IconButton, Button, Typography, Toolbar, Box, AppBar, Container} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from './Header.module.css';
import Image from "next/image";

const Header: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>

                    <IconButton color={"inherit"} edge="start" aria-label="menu">
                        <MenuIcon sx={{fontSize: {xs: '5vw',md: '3vw', xl:'3vw'}}}/>
                    </IconButton>

                    <Box sx={{ width: {xs: '100%'}, display:'flex', justifyContent:'center'}}>
                        <Box className={styles.logo} sx={{ width: {xs: '25vw'}, height:'100%'}}>
                        <Link href={"https://inspection.canada.ca"}>
                            <Image className={styles.logo} src={"/img/CFIA FIP FR WHITE 1.png"} alt="logo" layout="fill" objectPosition='50% 50%'  />
                        </Link>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button color={"inherit"} className={styles.languageButton} sx={{fontSize: {xs: '2vw',md: '2vw', xl:'1.5vw'}}}>
                            Français
                        </Button>
                        <IconButton color={"inherit"}>
                            <AccountCircleIcon fontSize={"large"} sx={{fontSize: {xs: '3vw',md: '3vw', xl:'2.5vw'}}}/>
                        </IconButton>
                    </Box>

                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;