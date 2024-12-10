import { useEffect, useState } from "react";
import SignUpModal from "@/components/AuthComponents/SignUpModal";
import LoginModal from "@/components/AuthComponents/LoginModal";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import useAlertStore from "@/stores/alertStore";

const RouteGuard = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isAuth, setAuth] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { showAlert } = useAlertStore();
  const { t } = useTranslation("authentification");

  const handleLogin = async (username: string, password: string) => {
    try {
      const res = await axios.post("/api/login", { username: username }, {
        headers: { Authorization: "Basic " + btoa(username + ":" + password) }
      })
      if (res.status >= 200 && res.status < 300) {
        document.cookie = "token=" + btoa(username) + "; SameSite=Strict;";
        setAuth(true);
        return "";
      }
    } catch(err){
      if(err instanceof AxiosError){
        if(err.status==404){
          showAlert(t("Errors.notFound"), "error");
          return t("Errors.notFound");
        }if(err.status==500){
          showAlert(err.response?.data.error, "error");
          return err.response?.data.error;
        }if(err.status==401){
          return t("Errors.unauthorized");
        }
      }
    }
    return t("Errors.unknown");
  };

  const handleSignup = async (
    username: string,
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    confirm: string,
  ) => {
    if(password!=confirm){
      return t("Errors.passwordMatch")
    }
    axios.post("/api/signup",{username:username}, {
      headers:{ Authorization:  "Basic " + btoa(username + ":" + password)}
    }).then(res=>{
      if(res.status>=200 && res.status<300){
        document.cookie = "token=" + btoa(username) + "; SameSite=Strict;";
        setAuth(true);
        return "";
      }
    }).catch(err=>{
      if(err.response){
        if(err.response.status==404){
          showAlert(t("Errors.notFound"), "error");
          return t("Errors.notFound");
        }if(err.response.status==409){
          return t("Errors.usernameTaken");
        }
        return err.response.data.error;
      }
    })
    return"";
  };



  const toggleMode = () => {
    setIsSignup(!isSignup);
  };


  useEffect(() => {
    const cookieStore = new Map();
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const [key, value] = cookie.split("=");
      if (key && value) {
        cookieStore.set(key.trim(), value.trim());
      }
    });
    setAuth(!!cookieStore.get("token"));
  }, []);

  return (
    <div>
      <>
        {isSignup ? (
          <SignUpModal isOpen={!isAuth} signup={handleSignup} onChangeMode={toggleMode} />
        ) : (
          <LoginModal isOpen={!isAuth} login={handleLogin} onChangeMode={toggleMode} />
        )}
      </>
      {children}
    </div>
  );
};

export default RouteGuard;
