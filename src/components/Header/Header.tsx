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

                    <IconButton color={"inherit"} edge="start" aria-label="menu" >
                        <MenuIcon sx={{fontSize: {xs: '5vw',md: '3vw', xl:'3vw'}}}/>
                    </IconButton>

                    <Box position={'relative'} sx={{ width: {xs: '100%'}, display:'flex', justifyContent:'center'}}>
                        <Box  sx={{ width: {xs: '25vw'}, height:'100%'}}>
                        <Link href={"https://inspection.canada.ca"}>
                        {/**Neew to use a classname here because it is a workaround to a bug**/ }
                            <Image className={styles.logo} src={"/img/CFIA FIP FR WHITE 1.png"} alt="logo" layout="fill" objectPosition='50% 50%'  />
                        </Link>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'end' }}>
                        <Button color={"inherit"} sx={{ padding: {xs: '0.1vw',md: '0.5vw', lg:'0.5vw', xl:'0.5vw'}, display:'contents', textTransform:'unset'}}>
                            <Typography sx={{alignSelf:'center', fontSize: {xs: '2vw',md: '1.5vw', lg:'1vw', xl:'1.2vw'}, textDecoration:'underline'}}>Français</Typography>
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