import React from 'react';
import { Container, Typography } from '@mui/material';

const Contact: React.FC = () => {
    return (
        <Container>
            <Typography variant="h1" component="h2" gutterBottom>
                Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
                If you have any questions or comments, please feel free to reach out to us.
            </Typography>
            {/* You could add a contact form here using MUI components */}
        </Container>
    );
};

export default Contact;