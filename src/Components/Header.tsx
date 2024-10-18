import * as React from 'react';
import Link from 'next/link';
import {IconButton, Button, Typography, Toolbar, Box, AppBar} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Image from "next/image";

interface HeaderProps {
    isSideNavOpen: boolean;
    handleDrawerToggle: () => void;  // Define the prop type
}

const Header = ({ handleDrawerToggle }: HeaderProps) => {
    return (
        <Box sx={{ flexGrow: 1}} >
            <AppBar position="static" >
                <Toolbar>
                    <IconButton color={"inherit"} onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align={"center"}>
                        <Link href={"https://inspection.canada.ca"}>
                            <Image style={{
                                width: '30%',
                                height: 'auto'
                            }}
                                   src={"/img/CFIA FIP FR WHITE 1.png"} alt="logo" width={0} height={0} sizes={"100vw"} />
                        </Link>
                    </Typography>
                    <Button color={"inherit"} sx={{
                        textTransform: 'none',
                        textDecoration: 'underline'
                    }}>
                        Français
                    </Button>
                    <IconButton color={"inherit"}>
                        <AccountCircleIcon fontSize={"large"} />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
