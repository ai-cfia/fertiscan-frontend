import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageButton from "../../Components/LanguageButton/LanguageButton";
import { useAlert } from "../../Utils/AlertContext";
import {
  login as authLogin,
  isAuthenticated,
  logout,
} from "../../Utils/Auth/AuthUtil";
import "./SettingPage.css";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const [uname_validated, setUnameValidated] = useState(false);
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAuth(isAuthenticated());
  }, []);

  const finalizeAuth = (messageKey: string) => {
    authLogin(uname, password);
    showAlert(t(messageKey), "confirm");
    setAuth(true);
    navigate("/");
  };

  const login = async () => {
    setIsLoading(true);

    if (process.env.VITE_APP_ACTIVATE_USING_JSON === "true") {
      finalizeAuth("loggedIn");
      setIsLoading(false);
      return;
    }

    console.info("logging in");
    axios
      .post(
        process.env.VITE_API_URL + "/login",
        new URLSearchParams({ uname, password }),
        {
          headers: {
            Authorization: "Basic " + btoa(uname + ":" + password),
          },
          timeout: 5000,
        },
      )
      .then((response) => {
        console.log(response);
        finalizeAuth("loggedIn");
      })
      .catch((error) => {
        if (error.response) {
          console.error("login failed:", error.response);
          console.info("signing up");
          axios
            .post(
              `${process.env.VITE_API_URL}/signup`,
              new URLSearchParams({
                username: uname,
                password: password,
              }),
              {
                headers: {
                  Authorization: "Basic " + btoa(uname + ":" + password),
                },
                timeout: 5000,
              },
            )
            .then((response) => {
              console.log(response);
              finalizeAuth("registered");
            })
            .catch((error) => {
              console.error("unexpected error during signup", error.message);
              showAlert(String(error), "error");
            });
        }
        console.error("unexpected error during login:", error.message);
        showAlert(String(error), "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    logout();
    setAuth(false);
  };

  return (
    <div>
      <h1>{t("settingH1")}</h1>
      <div className="settings">
        <div id="language">
          <label>{t("languageLabel")} : </label>
          <LanguageButton />
        </div>
        <hr />
        <div id="login">
          {auth ? (
            <div>
              <button onClick={handleLogout}>{t("logout")}</button>
            </div>
          ) : (
            <div>
              <div id="inputs">
                <div id="uname">
                  <label>{t("askForUName")} : </label>
                  <input
                    type="text"
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                  />
                </div>
                <div id="password">
                  <label>{t("askForPassword")} : </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div id="validate-uname">
                <div
                  className="checkbox-container"
                  onClick={() => setUnameValidated(!uname_validated)}
                >
                  <input
                    type="checkbox"
                    value="accepted-uname"
                    checked={uname_validated}
                    onChange={() => setUnameValidated(!uname_validated)}
                  />
                </div>
                <p id="accept-uname">
                  {t("acceptUName")}
                  <br />
                  {t("reminderSensitive")}
                </p>
              </div>
              <button
                className="language-button en send-uname"
                onClick={login}
                disabled={!uname_validated || uname === "" || isLoading}
              >
                {isLoading ? t("loading...") : t("login")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
