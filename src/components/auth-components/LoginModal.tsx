import { Modal, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingButton from "../LoadingButton";
import AuthBox from "./AuthBox";
import ErrorMessage from "./ErrorMessage";
import Form from "./Form";
import Password from "./Password";
import Title from "./Title";
import ToggleSign from "./ToggleSign";
import Username from "./Username";

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
      data-testid="modal"
      disableAutoFocus
      disableEnforceFocus
    >
      <AuthBox>
        <Title>{t("login.title")}</Title>
        <Form>
          <Username value={username} setValue={setUsername} />
          <Password value={password} setValue={setPassword} />
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <LoadingButton
            onClick={handleSubmit}
            disabled={username === "" || password === ""}
            loading={loading}
            text={t("login.title")}
            className="!pointer-events-auto !bg-white"
            data-testid="modal-submit"
          />
        </Form>
        <Typography
          data-testid="modal-change"
          id="toggleSign"
          className="!mt-4 !mb-4 text-center text-white"
        >
          {t("login.switchText")}
          <ToggleSign onChangeMode={onChangeMode}>
            {t("login.switchLink")}
          </ToggleSign>
        </Typography>
      </AuthBox>
    </Modal>
  );
};

export default LoginModal;
