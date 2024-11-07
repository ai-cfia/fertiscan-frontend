import LoginModal from "@/components/LoginModal";
import { useEffect, useState } from "react";

const RouteGuard = ({children}: Readonly<{ children: React.ReactNode }>) => {
  const [isAuth, setAuth] = useState(false)



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = (username:string, password:string)=>{
    // TODO: Implement login
    return "";
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSignup = (username:string, password:string, confirm:string)=>{
    // TODO: Implement signup
    return "";
  }

  useEffect(()=>{
    const cookieStore = new Map();
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const [key, value] = cookie.split('=');
      if(key && value){
        cookieStore.set(key.trim(),
          value.trim());
      }
    });
    setAuth(!!cookieStore.get('token'))
  },[])



  return (
    <div>
      <LoginModal isOpen={!isAuth} login={handleLogin} signup={handleSignup}/>
      {children}
    </div>
  )



}

export default RouteGuard;