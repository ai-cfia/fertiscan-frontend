import theme from "@/app/theme";
import IconInput from "@/components/IconInput";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingButton from "../LoadingButton";

interface SignUpProps {
  isOpen: boolean;
  signup: (
    username: string,
    password: string,
    confirm: string,
  ) => Promise<string>;
  onChangeMode: () => void;
}

const SignUpModal = ({ isOpen, signup, onChangeMode }: SignUpProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkedReminder, setReminderChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation("authentication");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    signup(username, password, confirmPassword).then((message) => {
      setErrorMessage(message);
      setLoading(false);
    });
  };

  return (
    <Modal
      open={isOpen}
      data-testid="modal"
      disableEnforceFocus
      disableAutoFocus
    >
      <Box className="absolute top-1/2 left-1/2 flex h-fit max-h-[500px] max-w-lg -translate-x-1/2 -translate-y-1/2 transform flex-col rounded-2xl bg-sky-900 px-4 py-4 shadow-2xl outline-none">
        <Typography
          className="!mb-8 pt-2 pl-4 text-white"
          data-testid="modal-title"
          id="modal-title"
          variant="h3"
          component="h2"
        >
          {t("signup.title")}
        </Typography>

        <form
          className={`margin-bottom-1 flex flex-col justify-between gap-4 ${errorMessage === "" ? "h-2/3" : "h-full"} px-8`}
        >
          <IconInput
            id="username"
            dataTestId="modal-username"
            icon={
              <AccountCircleIcon sx={{ color: "white", marginBottom: 1 }} />
            }
            placeholder={t("signup.username")}
            type="text"
            value={username}
            setValue={setUsername}
            aria-label={t("alt.userIcon")}
          />
          <IconInput
            id="password"
            dataTestId="modal-password"
            icon={<LockIcon sx={{ color: "white", marginBottom: 1 }} />}
            placeholder={t("signup.password")}
            type="password"
            value={password}
            setValue={setPassword}
            aria-label={t("alt.lockIcon")}
          />
          <IconInput
            id="confirm-password"
            dataTestId="modal-confirm-password"
            icon={<LockIcon sx={{ color: "white", marginBottom: 1 }} />}
            placeholder={t("signup.confirmPassword")}
            type="password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            aria-label={t("alt.lockIcon")}
          />

          <FormGroup className="!w-full">
            <FormControlLabel
              data-testid="modal-reminder"
              className="text-white"
              control={
                <Checkbox
                  className="!text-white"
                  disableRipple
                  value={checkedReminder}
                  onChange={() => setReminderChecked(!checkedReminder)}
                />
              }
              label={
                <Typography className="text-justify !text-xs">
                  {t("signup.dataPolicy")}
                  <br />
                  <u>{t("signup.dataReminder")}</u>
                </Typography>
              }
            />
          </FormGroup>

          <Typography
            id="error-message"
            data-testid="modal-error-message"
            sx={{
              display: errorMessage === "" ? "none" : "block",
              color: theme.palette.error.main,
            }}
          >
            {errorMessage}
          </Typography>

          <LoadingButton
            onClick={handleSubmit}
            disabled={
              username === "" ||
              password === "" ||
              confirmPassword === "" ||
              !checkedReminder
            }
            loading={loading}
            text={t("signup.title")}
            data-testid="modal-submit"
            className="!pointer-events-auto !bg-white"
          />
        </form>

        <Typography
          data-testid="modal-change"
          id="toggleSign"
          className="!mt-2 !mb-1 text-center text-white"
        >
          {t("signup.switchText")}
          <a
            href="#"
            role="button"
            tabIndex={0}
            id="toggleSignButton"
            data-testid="modal-change-button"
            className="cursor-pointer text-white underline focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              onChangeMode();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChangeMode();
              }
            }}
          >
            {t("signup.switchLink")}
          </a>
        </Typography>
      </Box>
    </Modal>
  );
};

export default SignUpModal;
