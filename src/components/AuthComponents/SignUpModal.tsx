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
  import IconInput from "@/components/IconInput";
  import { useState } from "react";

  interface SignUpProps {
    isOpen: boolean;
    signup: (
      username: string,
      password: string,
      confirm: string
    ) => Promise<string>;
    onChangeMode: () => void;
  }

  const SignUpModal = ({ isOpen, signup, onChangeMode }: SignUpProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [checkedReminder, setReminderChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = () => {
      signup(username, password, confirmPassword).then((message) => {
        setErrorMessage(message);
      });
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
            max-w-lg
            h-fit
            bg-sky-900
            outline-none
            shadow-2xl
            max-h-[500px]
            px-4
            py-4
            rounded-2xl
            flex
            flex-col
          "
        >
          <Typography
            className="
              text-white
              !mb-8
              pl-4
              pt-2
            "
            data-testid={"modal-title"}
            id="modal-title"
            variant="h3"
            component="h2"
          >
            Sign Up
          </Typography>
          <form
            className={`
              margin-bottom-1
              flex
              flex-col
              justify-between
              gap-4
            ${errorMessage === "" ? "h-2/3" : "h-full"}
              px-8
            `}
          >
            <IconInput
              id={"username"}
              dataTestId={"modal-username"}
              icon={<AccountCircleIcon sx={{ color: "white", marginBottom: 1 }} />}
              placeholder={"USERNAME"}
              type={"text"}
              value={username}
              setValue={setUsername}
            />
            <IconInput
              id={"password"}
              dataTestId={"modal-password"}
              icon={<LockIcon sx={{ color: "white", marginBottom: 1 }} />}
              placeholder={"PASSWORD"}
              type={"password"}
              value={password}
              setValue={setPassword}
            />
            <IconInput
              id={"confirm-password"}
              dataTestId={"modal-confirm-password"}
              icon={<LockIcon sx={{ color: "white", marginBottom: 1 }} />}
              placeholder={"CONFIRM PASSWORD"}
              type={"password"}
              value={confirmPassword}
              setValue={setConfirmPassword}
            />
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
                  <Typography className={"!text-xs text-justify"}>
                    By checking this box I understand that the data I have
                    entered will be stored and thus should not be sensitive
                    information.
                    <br />
                    <u>
                    As a reminder, work email, phone number or real name are
                    considered sensitive information.
                    </u>
                  </Typography>
                }
              />
            </FormGroup>
            <Typography
              id={"error-message"}
              data-testid={"modal-error-message"}
              sx={{
                display: errorMessage === "" ? "none" : "block",
                }}
            >
              {errorMessage}
            </Typography>
            <Button
              data-testid={"modal-submit"}
              disabled={
                username === "" ||
                password === "" ||
                confirmPassword === "" ||
                !checkedReminder
              }
              className={`
                !bg-white
                !pointer-events-auto
                ${username === "" || password === "" || confirmPassword === "" || !checkedReminder ? "!cursor-not-allowed !text-gray-400" : "!cursor-pointer !text-black"}
              `}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </form>
          <Typography
            data-testid={"modal-change"}
            id={"toggleSign"}
            className="
              text-white
              !mt-2
              !mb-1
              text-center
            "
          >
            Already have an account?{" "}
            <a
              id={"toggleSignButton"}
              data-testid={"modal-change-button"}
              className={"underline text-white cursor-pointer"}
              onClick={onChangeMode}
            >
              Login
            </a>
          </Typography>
        </Box>
      </Modal>
    );
  };

  export default SignUpModal;
