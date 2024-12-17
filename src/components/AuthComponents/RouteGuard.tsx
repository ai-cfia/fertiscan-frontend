import LoginModal from "@/components/AuthComponents/LoginModal";
import SignUpModal from "@/components/AuthComponents/SignUpModal";
import useAlertStore from "@/stores/alertStore";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const RouteGuard = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isAuth, setAuth] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { showAlert } = useAlertStore();
  const { t } = useTranslation("authentication");

  const handleLogin = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        "/api/login",
        { username: username },
        {
          headers: {
            Authorization: "Basic " + btoa(username + ":" + password),
          },
        },
      );
      if (res.status >= 200 && res.status < 300) {
        Cookies.set("token", btoa(username), { sameSite: "Strict" });
        setAuth(true);
        return "";
      }
      return t("errors.unknown");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.status == 401) {
          return t("errors.unauthorized");
        }
        if (err.status == 404) {
          showAlert(t("errors.notFound"), "error");
          return t("errors.notFound");
        }
      }
      return t("errors.unknown");
    }
  };

  const handleSignup = async (
    username: string,
    password: string,
    confirm: string,
  ) => {
    if (password != confirm) {
      return t("errors.passwordMatch");
    }
    try {
      const res = await axios.post(
        "/api/signup",
        { username: username },
        {
          headers: {
            Authorization: "Basic " + btoa(username + ":" + password),
          },
        },
      );
      if (res.status >= 200 && res.status < 300) {
        Cookies.set("token", btoa(username), { sameSite: "Strict" });
        setAuth(true);
        return "";
      }
      return t("errors.unknown");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          if (err.response.status == 404) {
            showAlert(t("errors.notFound"), "error");
            return t("errors.notFound");
          }
          if (err.response.status == 409) {
            return t("errors.usernameTaken");
          }
        }
      }
      return t("errors.unknown");
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
  };

  useEffect(() => {
    setAuth(!!Cookies.get("token"));
  }, []);

  return (
    <div data-testid={"route-guard-root"}>
      <>
        {isSignup ? (
          <SignUpModal
            isOpen={!isAuth}
            signup={handleSignup}
            onChangeMode={toggleMode}
          />
        ) : (
          <LoginModal
            isOpen={!isAuth}
            login={handleLogin}
            onChangeMode={toggleMode}
          />
        )}
      </>
      {children}
    </div>
  );
};

export default RouteGuard;
