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
    <Modal open={isOpen} data-testid={"modal"}>
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
          h-fit
          bg-sky-900
          outline-none
          shadow-2xl
          rounded-2xl
          flex
          flex-col
          max-h-96
          px-4
          pt-6
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
          {t("login.title")}
        </Typography>
        <form
          className={`
            flex
            flex-col
            justify-between
            gap-6
            ${errorMessage === "" ? "h-fit" : "h-full"}
            px-8
          `}
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
            className="!bg-white !pointer-events-auto"
            data-testid="modal-submit"
          />
        </form>
        <Typography
          data-testid={"modal-change"}
          id={"toggleSign"}
          className="
            text-white
            !mt-4
            !mb-4
            text-center
          "
        >
          {t("login.switchText")}
          <a
            id={"toggleSignButton"}
            data-testid={"modal-change-button"}
            className={"underline text-white cursor-pointer"}
            onClick={onChangeMode}
          >
            {t("login.switchLink")}
          </a>
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoginModal;
