import React, { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Checkbox,
  FormControlLabel, FormGroup, FormControl, FormHelperText, Link,
  InputAdornment, IconButton
} from '@mui/material';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const theme = createTheme();

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
  const handleCheckChange = () => setChecked(!checked);

  const validateInputs = () => {
    let valid = true;
    if (username.trim() === '') {
      setUsernameError('Username is required');
      valid = false;
    } else {
      setUsernameError('');
    }

    if (password.trim() === '') {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = () => {
    if (validateInputs()) {
      // Proceed with login logic
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 450,
          backgroundColor: '#0e507f',
          borderRadius: '10px',
          boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.2)',
          padding: '32px',
          color: 'white',
          textAlign: 'left'
        }}>
          <Typography variant="h5" component="h1" sx={{ marginBottom: '24px', fontSize: '2.5rem' }}>Login</Typography>

          <FormControl component="fieldset" variant="standard" sx={{ m: 0 }}>
            <FormGroup>
              <TextField
                id="username"
                fullWidth
                variant="standard"
                label="Username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  )
                }}
                sx={{ marginBottom: '16px', '.MuiInputLabel-root.Mui-focused': { color: '#0e507f' } }}
              />

              <TextField
                id="password"
                fullWidth
                variant="standard"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  style: { color: 'white' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ marginBottom: '16px', '.MuiInputLabel-root.Mui-focused': { color: '#0e507f' } }}
              />
              {passwordError && (
                <Box display="flex" alignItems="center" sx={{ color: 'error.main', marginBottom: 2 }}>
                  <ErrorOutlineOutlinedIcon fontSize='medium' />
                  <FormHelperText error sx={{ marginLeft: 1 }}>
                    The username or password is not valid. Please try again!
                  </FormHelperText>
                </Box>
              )}

              <FormControlLabel
                control={<Checkbox name="checked" color="primary" checked={checked} onChange={handleCheckChange} sx={{ color: '#fff' }} />}
                label={<span style={{ color: 'white', fontSize: '0.875rem' }}> By checking this box I understand that the data I have entered will be stored and thus should not be sensitive information. </span>}
                sx={{ marginBottom: '16px' }}
              />

              <Typography variant="body2" sx={{ color: 'white', fontSize: '0.875rem', marginBottom: '16px' }}>
                <span>As a reminder, work email, phone number or real name are considered sensitive information.</span>
              </Typography>
            </FormGroup>

            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#0e507f',
                marginTop: '16px',
                padding: '10px',
                '&:hover': { backgroundColor: 'white', color: '#0e507f', boxShadow: 'none', fontSize:'1.5rem' }
              }}
              onClick={handleLogin}
              disabled={!checked}
            >
              Login
            </Button>
            <Link href="#" sx={{
              color: 'white',
              marginTop: '16px',
              display: 'block',
              textAlign: 'center',
              fontSize: '0.875rem'
            }}>
              Don't have an account? Create Account
            </Link>
          </FormControl>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default LoginModal;