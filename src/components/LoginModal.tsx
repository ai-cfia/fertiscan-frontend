import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import theme from "@/app/theme";
import IconInput from "@/components/IconInput";
import { useState } from "react";

interface LoginProps {
  isOpen: boolean;
  login: (username: string, password: string) => Promise<string>;
  signup: (
    username: string,
    password: string,
    confirm: string,
  ) => Promise<string>;
}
const LoginModal = ({ isOpen, login, signup }: LoginProps) => {
  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkedReminder, setReminderChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangeModal = () => {
    setErrorMessage("");
    setIsSignup(!isSignup);
    setReminderChecked(false);
  };

  const handleSubmit = () => {
    if (isSignup) {
      signup(username, password, confirmPassword).then((message) => {
        setErrorMessage(message);
      });
    } else {
      login(username, password).then((message) => {
        setErrorMessage(message);
      });
    }
  };

  return (
    <Modal open={isOpen}>
      <Box
        className="
          absolute
          top-1/2
          left-1/2
          transform
          -translate-x-1/2
          -translate-y-1/2
          w-1/2
          max-w-lg
          min-w-fit
          h-2/3
          bg-sky-900
          outline-none
          shadow-2xl
          p-4
          rounded-2xl
          flex
          flex-col
        "
      >
        <Typography
          className="
            text-white
            !mb-16
          "
          data-testid={"modal-title"}
          id="modal-title"
          variant="h3"
          component="h2"
        >
          {isSignup ? "Sign Up" : "Login"}
        </Typography>
        <form
          className="
            margin-bottom-1
            flex
            flex-col
            justify-between
            gap-4
            h-full
          "
        >
          <IconInput
            id={"username"}
            dataTestId={"modal-username"}
            icon={
              <AccountCircleIcon
                sx={{ color: "white", marginBottom: 1 }}
              ></AccountCircleIcon>
            }
            placeholder={"USERNAME"}
            type={"text"}
            value={username}
            setValue={setUsername}
          />
          <IconInput
            id={"password"}
            dataTestId={"modal-password"}
            icon={
              <LockIcon sx={{ color: "white", marginBottom: 1 }}></LockIcon>
            }
            placeholder={"PASSWORD"}
            type={"password"}
            value={password}
            setValue={setPassword}
          />
          {isSignup && (
            <IconInput
              id={"confirm-password"}
              dataTestId={"modal-confirm-password"}
              icon={
                <LockIcon sx={{ color: "white", marginBottom: 1 }}></LockIcon>
              }
              placeholder={"CONFIRM PASSWORD"}
              type={"password"}
              value={confirmPassword}
              setValue={setConfirmPassword}
            />
          )}
          {isSignup && (
            <FormGroup className={"!w-full"}>
              <FormControlLabel
                data-testid={"modal-reminder"}
                className={"text-white"}
                control={
                  <Checkbox
                    className={"!text-white"}
                    disableRipple
                    value={checkedReminder}
                    onChange={() => setReminderChecked(!checkedReminder)}
                  />
                }
                label={
                  <Typography className={"!text-xs"}>
                    By checking this box I understand that the data I have
                    entered will be stored and thus should not be sensitive
                    information.
                    <br />
                    As a reminder, work email, phone number or real name are
                    considered sensitive information.
                  </Typography>
                }
              />
            </FormGroup>
          )}

          <Typography
            id={"error-message"}
            data-testid={"modal-error-message"}
            sx={{
              color: theme.palette.error.main,
            }}
            height={"40px"}
          >
            {errorMessage}
          </Typography>
          <Button
            data-testid={"modal-submit"}
            disabled={
              username === "" ||
              password === "" ||
              (isSignup && (confirmPassword === "" || !checkedReminder))
            }
            className={`
            !bg-white
            !pointer-events-auto
            ${username === "" || password === "" || (isSignup && (confirmPassword === "" || !checkedReminder)) ? "!cursor-not-allowed !text-gray-400" : "!cursor-pointer !text-black"}
          `}
            onClick={handleSubmit}
          >
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>
        <Typography
          data-testid={"modal-change"}
          id={"toggleSign"}
          className="
            text-white
            !mt-4
            !mb-8
          "
        >
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <a
            id={"toggleSignButton"}
            data-testid={"modal-change-button"}
            className={"underline text-white cursor-pointer"}
            onClick={() => {
              handleChangeModal();
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </a>
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoginModal;
