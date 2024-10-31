import { Box, Button, Checkbox, FormControlLabel, FormGroup, Modal, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from '@mui/icons-material/Lock';
import { useRouter } from "next/navigation";
import theme from "@/app/theme";
import IconInput from "@/components/IconInput";
import { useState } from "react";





interface LoginProps {
  isOpen: boolean;
}
const LoginModal = ({isOpen}:LoginProps) => {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkedReminder, setReminderChecked] = useState(false);

  return (
    <Modal
      open={isOpen}
      onClose={() => router.push('/')}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 500,
        background: theme.palette.secondary.main,
        border: '2px solid #000',
        outline:"none",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',

      }}>
        <Typography id="modal-modal-title" variant="h3" component="h2">
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>
        <form
          style={{
            marginBottom: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent:"center",
            gap: '1rem',
            height:'100%',
          }}
        >
        <IconInput
          id={"username"}
          icon={
            <AccountCircleIcon sx={{color:"white", marginBottom:1}}></AccountCircleIcon>
          }
          placeholder={"USERNAME"}
          type={"text"}
          value={username}
          setValue={setUsername}/>
        <IconInput
          id={"password"}
          icon={
            <LockIcon sx={{color:"white", marginBottom:1}}></LockIcon>
          }
          placeholder={"PASSWORD"}
          type={"password"}
          value={password}
          setValue={setPassword}
        />
        {isSignup && (
          <IconInput
            id={"confirmPassword"}
            icon={
              <LockIcon sx={{color:"white", marginBottom:1}}></LockIcon>
            }
            placeholder={"CONFIRM PASSWORD"}
            type={"password"}
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
        )}
        {isSignup && (
          <FormGroup>
            <FormControlLabel
              control={<Checkbox value={checkedReminder} onChange={()=>setReminderChecked(!checkedReminder)}/>}
              label={
                <Typography sx={{fontSize:"x-small"}}>
                  By checking this box I understand that the data I have entered will be stored and thus should not be sensitive information.<br/>
                  As a reminder, work email, phone number or real name are considered sensitive information.
                </Typography>
            }
            />
          </FormGroup>
        )}

        <Typography
          id={"error_message"}
          sx={{
            color: theme.palette.error.main,
          }}
          height={"20px"}
        ></Typography>
        <Button
          disabled={username==="" || password==="" || (isSignup && (confirmPassword==="" || !checkedReminder))}
          sx={{
            backgroundColor:"white",
            color:theme.palette.text.primary,
          }}
          onClick={() => console.log("Login")}
        >{isSignup? "Sign up" : "Login"}</Button>
        <Typography
          id={"toggleSign"}
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <a
            id={"toggleSignButton"}
            style={{
              color: theme.palette.text.secondary,
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              setIsSignup(!isSignup)
              setReminderChecked(false)
            }}
          >{isSignup? "Login":"Sign up"}</a>
        </Typography>
      </form>
      </Box>
    </Modal>
  )
}

export default LoginModal;