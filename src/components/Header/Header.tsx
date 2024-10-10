import * as React from 'react';
import Link from 'next/link';
import {IconButton, Button, Typography, Toolbar, Box, AppBar} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const Header: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton color={"inherit"}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align={"center"}>
                        <img src={"@/assets/CFIA FI{ FR WHITE 1.png"} alt="logo" style={{ width: '150px' }} />
                    </Typography>
                    <Link href="/" passHref>
                        <Button color="inherit">Home</Button>
                    </Link>
                    <Link href="/about" passHref>
                        <Button color="inherit">About</Button>
                    </Link>
                    <Link href="/contact" passHref>
                        <Button color="inherit">Contact</Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;