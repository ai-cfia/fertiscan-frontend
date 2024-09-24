import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../Utils/AlertContext.tsx";
import "./LoginPage.css";

function LoginPage() {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [uname_validated, setUnameValidated] = useState(false);
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");

  const goToHome = () => {
    navigate("/");
  };

  const login = () => {
    const form = new FormData();
    form.append("username", uname);
    form.append("password", password);
    if (process.env.VITE_APP_ACTIVATE_USING_JSON === "true") {
      document.cookie = `auth=${btoa(uname + ":" + password)}`;
      showAlert(t("loggedIn"), "confirm");
      goToHome();
      return;
    }
    fetch(process.env.VITE_API_URL + "/login", {
      method: "POST",
      body: form,
      headers: {
        Authorization: "Basic " + btoa(uname + ":" + password),
      },
    })
      .then((r) => {
        if (r.status !== 200) {
          fetch(process.env.VITE_API_URL + "/signup", {
            method: "POST",
            body: form,
            headers: {
              Authorization: "Basic " + btoa(uname + ":" + password),
            },
          })
            .then((r) => {
              if (r.status == 401) {
                r.json().then((data) => {
                  showAlert(data.error, "error");
                });
              } else {
                document.cookie = `auth=${btoa(uname + ":" + password)}`;
                showAlert(t("loggedIn"), "confirm");
                goToHome();
              }
            })
            .catch((e) => {
              showAlert(e, "error");
            });
        } else {
          document.cookie = `auth=${btoa(uname + ":" + password)}`;
          showAlert(t("registered"), "confirm");
          goToHome();
        }
      })
      .catch((e) => {
        showAlert(e, "error");
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>{t("loginH1")}</h1>
        <div id={"login"}>
          <div id={"inputs"}>
            <div id={"uname"}>
              <label>{t("askForUName")} : </label>
              <input
                type={"text"}
                value={uname}
                onChange={(e) => setUname(e.target.value)}
              ></input>
            </div>
            <div id={"password"}>
              <label>{t("askForPassword")} : </label>
              <input
                type={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
          </div>
          <div id={"validate-uname"}>
            <input
              type="checkbox"
              value={"accepted-uname"}
              checked={uname_validated}
              onChange={() => setUnameValidated(!uname_validated)}
            />
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
export default LoginPage;
