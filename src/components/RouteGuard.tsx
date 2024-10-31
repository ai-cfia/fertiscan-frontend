import LoginModal from "@/components/LoginModal";
import { useEffect, useState } from "react";

const RouteGuard = ({children}: Readonly<{ children: React.ReactNode }>) => {
  const [isAuth, setAuth] = useState(false)


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
      <LoginModal isOpen={!isAuth} />
      {children}
    </div>
  )



}

export default RouteGuard;