import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        My App
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