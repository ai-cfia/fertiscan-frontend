import React from 'react';
import { Modal, Box, Typography, TextField, Button, Checkbox, FormControlLabel, Link, InputAdornment } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styles from './Login.module.css';

const theme = createTheme();

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose}>
        <Box className={styles.modalStyle}>
          <Typography variant="h5" component="h1">Login</Typography>
          <TextField
            id="standard-basic"
            fullWidth
            variant="standard"
            label="Username"
            placeholder="Username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="standard-basic"
            variant="standard"
            fullWidth
            label="Password"
            type="password"
            placeholder="Password"
            color="primary"
            InputProps={{
              style: { color: 'white' },
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={<Checkbox name="checked" style={{ color: '#fff' }} />}
            label={<span className={styles.checkBoxLabel}> By checking this box I understand that the data I have entered will be stored and thus should not be sensitive information. </span>}
          />
          <Typography variant="body2" className={styles.checkBoxLabel}>
            <span>As a reminder, work email, phone number or real name are considered sensitive information.</span>
          </Typography>
          <Button fullWidth variant="contained" className={styles.button}>Login</Button>
          <Link href="#" className={styles.link}>Don't have an account? Create Account</Link>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

export default LoginModal;