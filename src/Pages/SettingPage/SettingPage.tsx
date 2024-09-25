import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageButton from "../../Components/LanguageButton/LanguageButton";
import { isAuthenticated, logout } from "../../Utils/Auth/AuthUtil";
import { useAlert } from "../../Utils/AlertContext";
import "./SettingPage.css";

function SettingsPage() {
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

  const login = async () => {
    setIsLoading(true);
    const form = new FormData();
    form.append("username", uname);
    form.append("password", password);
    if (process.env.VITE_APP_ACTIVATE_USING_JSON === "true") {
      document.cookie = `auth=${btoa(uname + ":" + password)}`;
      showAlert(t("loggedIn"), "confirm");
      setIsLoading(false);
      window.location.reload();
      return;
    }
    try {
      const loginResponse = await fetch(process.env.VITE_API_URL + "/login", {
        method: "POST",
        body: form,
        headers: {
          Authorization: "Basic " + btoa(uname + ":" + password),
        },
      });
      if (loginResponse.status !== 200) {
        const signupResponse = await fetch(
          process.env.VITE_API_URL + "/signup",
          {
            method: "POST",
            body: form,
            headers: {
              Authorization: "Basic " + btoa(uname + ":" + password),
            },
          },
        );
        if (signupResponse.status == 401) {
          const data = await signupResponse.json();
          showAlert(data.error, "error");
        } else {
          document.cookie = `auth=${btoa(uname + ":" + password)}`;
          showAlert(t("loggedIn"), "confirm");
          setAuth(true);
          window.location.reload();
        }
      } else {
        document.cookie = `auth=${btoa(uname + ":" + password)}`;
        showAlert(t("registered"), "confirm");
        setAuth(true);
        window.location.reload();
      }
    } catch (e) {
      showAlert(String(e), "error");
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
}

export default SettingsPage;
