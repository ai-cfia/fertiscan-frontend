import theme from "@/app/theme";
import IconInput from "@/components/IconInput";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingButton from "../LoadingButton";

interface LoginProps {
  isOpen: boolean;
  login: (username: string, password: string) => Promise<string>;
  onChangeMode: () => void;
}

const LoginModal = ({ isOpen, login, onChangeMode }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation("authentication");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    login(username, password).then((message) => {
      console.log(message);
      setErrorMessage(message);
      setLoading(false);
    });
  };

  return (
    <Modal
      open={isOpen}
      data-testid={"modal"}
      disableAutoFocus
      disableEnforceFocus
    >
      <Box className="absolute top-1/2 left-1/2 flex h-fit max-h-96 w-1/2 max-w-lg min-w-fit -translate-x-1/2 -translate-y-1/2 transform flex-col rounded-2xl bg-sky-900 px-4 pt-6 shadow-2xl outline-none">
        <Typography
          className="!mb-8 pt-2 pl-4 text-white"
          data-testid={"modal-title"}
          id="modal-title"
          variant="h3"
          component="h2"
        >
          {t("login.title")}
        </Typography>
        <form
          className={`flex flex-col justify-between gap-6 ${errorMessage === "" ? "h-fit" : "h-full"} px-8`}
        >
          <IconInput
            id={"username"}
            dataTestId={"modal-username"}
            icon={
              <AccountCircleIcon sx={{ color: "white", marginBottom: 1 }} />
            }
            placeholder={t("login.username")}
            type={"text"}
            value={username}
            setValue={setUsername}
            arial-label={t("alt.userIcon")}
          />
          <IconInput
            id={"password"}
            dataTestId={"modal-password"}
            icon={<LockIcon sx={{ color: "white", marginBottom: 1 }} />}
            placeholder={t("login.password")}
            type={"password"}
            value={password}
            setValue={setPassword}
            arial-label={t("alt.lockIcon")}
          />
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
            disabled={username === "" || password === ""}
            loading={loading}
            text={t("login.title")}
            className="!pointer-events-auto !bg-white"
            data-testid="modal-submit"
          />
        </form>
        <Typography
          data-testid={"modal-change"}
          id={"toggleSign"}
          className="!mt-4 !mb-4 text-center text-white"
        >
          {t("login.switchText")}
          <a
            href="#"
            role="button"
            tabIndex={0}
            id="toggleSignButton"
            data-testid="modal-change-button"
            className="cursor-pointer text-white underline focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onClick={(e) => {
              e.preventDefault(); // Prevent scrolling to top
              onChangeMode();
            }}
          >
            {t("login.switchLink")}
          </a>
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoginModal;
