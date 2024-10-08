import React from 'react';
import { Container, Typography } from '@mui/material';

const About: React.FC = () => {
    return (
        <Container>
            <Typography variant="h1" component="h2" gutterBottom>
                About Us
            </Typography>
            <Typography variant="body1" paragraph>
                Welcome to our website. This page provides information about our company and team.
            </Typography>
        </Container>
    );
};

export default About;