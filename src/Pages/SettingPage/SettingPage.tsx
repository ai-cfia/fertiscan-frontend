import "./SettingPage.css";
import { useTranslation } from "react-i18next";
import LanguageButton from "../../Components/LanguageButton/LanguageButton";
import { useState } from "react";
import { useAlert } from "../../Utils/AlertContext.tsx";

function SettingPage() {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const [uname_validated, setUnameValidated] = useState(false);
  const [uname, setUname] = useState("");
  const login = () => {
    const form = new FormData();
    form.append("username", uname);
    form.append("password", "");
    if (process.env.VITE_APP_ACTIVATE_USING_JSON == "true") {
      document.cookie = `username=${uname}`;
      showAlert(t("loggedIn"), "confirm");
      return;
    }
    fetch(process.env.API_URL + "/signup", {
      method: "POST",
      body: form,
    })
      .then((r) => {
        if (r.status !== 201) {
          fetch(process.env.API_URL + "/login", {
            method: "POST",
            body: form,
          })
            .then((r) => {
              if (r.status !== 200) {
                r.json().then((data) => {
                  showAlert(data.error, "error");
                });
              } else {
                document.cookie = `username=${uname}`;
                showAlert(t("loggedIn"), "confirm");
              }
            })
            .catch((e) => {
              showAlert(e, "error");
            });
        } else {
          document.cookie = `username=${uname}`;
          showAlert(t("registered"), "confirm");
        }
      })
      .catch((e) => {
        showAlert(e, "error");
      });
  };

  return (
    <div className="${theme}">
      <h1>{t("settingH1")}</h1>

      <div className="settings">
        <div id="language">
          <label>{t("languageLabel")} : </label>
          <LanguageButton />
        </div>
        <hr />
        <div id={"uname"}>
          <label>{t("askForUName")} : </label>
          <input
            type={"text"}
            value={uname}
            onChange={(e) => setUname(e.target.value)}
          ></input>
          <div id={"validate-uname"}>
            <div
              className={"checkbox-container"}
              onClick={() => setUnameValidated(!uname_validated)}
            >
              <input
                type="checkbox"
                value={"accepted-uname"}
                checked={uname_validated}
                onChange={() => setUnameValidated(!uname_validated)}
              />
            </div>
            <p id={"accept-uname"}>
              {t("acceptUName")}
              <br />
              {t("reminderSensitive")}
            </p>
          </div>
          <button
            className={"language-button en send-uname"}
            onClick={login}
            disabled={!uname_validated || uname === ""}
          >
            {t("login")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
