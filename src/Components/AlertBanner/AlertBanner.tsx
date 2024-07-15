import { useEffect, useContext, useState } from "react";
import { AlertContext } from "../../Utils/AlertContext";
import "./AlertBanner.css";
import errorIcon from "../../assets/errorIcon.png";
import confirmIcon from "../../assets/confirmIcon.svg";

const AlertBanner = () => {
  const { message, type, clearAlert } = useContext(AlertContext);  
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer:  ReturnType<typeof setTimeout>;
    if (message) {
      setIsActive(true);
      timer = setTimeout(() => {
        setIsActive(false);
        clearAlert();
      }, 5000);
    }
    return () => timer && clearTimeout(timer);
  }, [message, clearAlert]);

  if (!isActive) return null;

  return (
    <div className={`banner ${type} ${isActive ? "show" : ""}`}>
      <div className="alert">
        <img className="icon" src={type === 'error' ? errorIcon : confirmIcon} alt={`${type} Icon`} />
        <span className="message">{message}</span>
      </div>
    </div>
  );
};

export default AlertBanner;