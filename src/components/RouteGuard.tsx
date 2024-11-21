import AuthenticationContainer from "@/components/AuthenticationContainer";
import { useEffect, useState } from "react";

const RouteGuard = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isAuth, setAuth] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = async (username: string, password: string) => {
    const headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(username + ":" + password));
    const res = await fetch(process.env.API_URL + "/login", {
      method: "POST",
      headers: headers,
    });
    if (res.status != 200) {
      if (res.status == 404) {
        return "Couldnt find resource, backend might be off";
      }
      return "Invalid username or password";
    } else {
      document.cookie = "token=" + btoa(username) + ";";
      return "";
    }
  };

  const handleSignup = async (
    username: string,
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    confirm: string,
  ) => {
    const headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(username + ":" + password));
    const res = await fetch(process.env.API_URL + "/login", {
      method: "POST",
      headers: headers,
    });
    if (res.status != 200) {
      return "Error during creation of user";
    } else {
      document.cookie = "token=" + btoa(username) + ";";
      return "";
    }
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
      <AuthenticationContainer isOpen={!isAuth} login={handleLogin} signup={handleSignup} />
      {children}
    </div>
  );
};

export default RouteGuard;
