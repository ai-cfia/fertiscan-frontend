import { Box, Button, Modal, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import theme from "@/app/theme";
import IconInput from "@/components/IconInput";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useDevStore from "@/stores/devStore";

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
  const isPasswordVisible = useDevStore((state) => state.isPasswordVisible); // DevMenu
  const setIsPasswordVisible = useDevStore((state) => state.setIsPasswordVisible); // DevMenu

  const handleSubmit = () => {
    login(username, password).then((message) => {
      console.log(message);
      setErrorMessage(message);
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
          onClick={setIsPasswordVisible}
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
          />
          {isPasswordVisible && (
            <>

          <IconInput
            id={"password"}
            dataTestId={"modal-password"}
            icon={<LockIcon sx={{ color: "white", marginBottom: 1 }} />}
            placeholder={t("login.password")}
            type={"password"}
            value={password}
            setValue={setPassword}
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
          </>
)}
          <Button
            data-testid={"modal-submit"}
            disabled={username === "" || password === ""}
            className={`
              !bg-white
              !pointer-events-auto
              ${username === "" || password === "" ? "!cursor-not-allowed !text-gray-400" : "!cursor-pointer !text-black"}
            `}
            onClick={handleSubmit}
          >
            {t("login.title")}
          </Button>
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
