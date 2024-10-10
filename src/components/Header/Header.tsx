import * as React from 'react';
import Link from 'next/link';
import {IconButton, Button, Typography, Toolbar, Box, AppBar} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from './Header.module.css';
import Image from "next/image";

const Header: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton color={"inherit"}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align={"center"}>
                        <Link href={"https://inspection.canada.ca"}>
                            <Image className={styles.logo} src={"/img/CFIA FIP FR WHITE 1.png"} alt="logo" width={0} height={0} sizes={"100vw"}/>
                        </Link>
                    </Typography>
                    <Link href="/" passHref>
                        <Button color="inherit">Home</Button>
                    </Link>
                    <Link href="/captur" passHref>
                        <Button color="inherit">Capture</Button>
                    </Link>
                    <Link href="/about" passHref>
                        <Button color="inherit">About</Button>
                    </Link>
                    <Link href="/contact" passHref>
                        <Button color="inherit">Contact</Button>
                    </Link>
                    <Button color={"inherit"} className={styles.languageButton}>
                        Français
                    </Button>
                    <IconButton color={"inherit"}>
                        <AccountCircleIcon fontSize={"large"}/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;