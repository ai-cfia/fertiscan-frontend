import { useEffect, useContext, useState } from 'react';
import { ErrorContext } from '../../Utils/ErrorContext';
import './AlertBanner.css';
import editIcon from "../../assets/errorIcon.png";

const AlertBanner = () => {
  // Assuming ErrorContext is the proper React context you want to use.
  const { message, clearAlert } = useContext(ErrorContext);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (message) {
        setIsActive(true);
      timer = setTimeout(() => {
        setIsActive(false);
        clearAlert();
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [message, clearAlert]);

  return (
    <div className={`error-banner notAffectedTopPadding ${isActive ? 'show' : ''}`}>
      <div className="error-alert">
        <img className="error-alert__icon" src={editIcon} alt="Error Icon" />
        <span className="error-alert__message">{message}</span>
      </div>
    </div>
  );
};

export default AlertBanner;