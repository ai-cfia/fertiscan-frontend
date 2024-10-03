import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageButton from "../../Components/LanguageButton/LanguageButton";
import {
  isAuthenticated,
  login as authLogin,
  logout,
} from "../../Utils/Auth/AuthUtil";
import { useAlert } from "../../Utils/AlertContext";
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

  interface RequestOptions extends RequestInit {
    timeout?: number;
  }

  interface MakeRequestResponse extends Response {}

  const makeRequest = async (
    endpoint: string,
  ): Promise<MakeRequestResponse> => {
    const form = new FormData();
    form.append("username", uname);
    form.append("password", password);
    const response = await timeoutFetch(endpoint, {
      method: "POST",
      body: form,
      headers: {
        Authorization: "Basic " + btoa(uname + ":" + password),
      },
    });
    return response;
  };

  const timeoutFetch = async (
    url: string,
    options: RequestOptions,
    timeout = 5000,
  ): Promise<Response> => {
    const controller = new AbortController();
    const { signal } = controller;
    const fetchPromise = fetch(url, { ...options, signal });
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetchPromise;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const finalizeAuth = (messageKey: string) => {
    authLogin(uname, password);
    showAlert(t(messageKey), "confirm");
    setAuth(true);
    window.location.reload();
    navigate("/");
  };

  const login = async () => {
    setIsLoading(true);
    const form = new FormData();
    form.append("username", uname);
    form.append("password", password);
    if (process.env.VITE_APP_ACTIVATE_USING_JSON === "true") {
      finalizeAuth("loggedIn");
      setIsLoading(false);
      return;
    }
    try {
      const loginResponse = await makeRequest(
        process.env.VITE_API_URL + "/login",
      );
      if (loginResponse.status > 200 && loginResponse.status < 299) {
        const signupResponse = await makeRequest(
          process.env.VITE_API_URL + "/signup",
        );
        if (signupResponse.status > 200 && signupResponse.status < 299) {
          const data = await signupResponse.json();
          showAlert(data.error, "error");
        } else {
          finalizeAuth("registered");
        }
      } else {
        finalizeAuth("loggedIn");
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        showAlert(t("requestTimeout"), "error"); // Add a translation key for requestTimeout
      } else {
        showAlert(String(e), "error");
      }
    } finally {
      setIsLoading(false);
    }
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
