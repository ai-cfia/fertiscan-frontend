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
    <Modal open={isOpen} data-testid={"modal"}>
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
          {t("signup.title")}
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
            icon={
              <AccountCircleIcon sx={{ color: "white", marginBottom: 1 }} />
            }
            placeholder={t("signup.username")}
            type={"text"}
            value={username}
            setValue={setUsername}
          />
          <IconInput
            id={"password"}
            dataTestId={"modal-password"}
            icon={<LockIcon sx={{ color: "white", marginBottom: 1 }} />}
            placeholder={t("signup.password")}
            type={"password"}
            value={password}
            setValue={setPassword}
          />
          <IconInput
            id={"confirm-password"}
            dataTestId={"modal-confirm-password"}
            icon={<LockIcon sx={{ color: "white", marginBottom: 1 }} />}
            placeholder={t("signup.confirmPassword")}
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
                  {t("signup.dataPolicy")}
                  <br />
                  <u>{t("signup.dataReminder")}</u>
                </Typography>
              }
            />
          </FormGroup>
          <Typography
            id={"error-message"}
            data-testid={"modal-error-message"}
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
            className="!bg-white !pointer-events-auto"
            data-testid="modal-submit"
          />
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
          {t("signup.switchText")}
          <a
            id={"toggleSignButton"}
            data-testid={"modal-change-button"}
            className={"underline text-white cursor-pointer"}
            onClick={onChangeMode}
          >
            {t("signup.switchLink")}
          </a>
        </Typography>
      </Box>
    </Modal>
  );
};

export default SignUpModal;
