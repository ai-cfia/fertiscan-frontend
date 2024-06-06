import { useState } from "react";
import "./Button_approve.css";
import acceptIcon from "../../assets/acceptIcon.svg";


const Button_approve = () => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 400);
  };

  return (
    <button
      className={`button-approve ${isActive ? "active" : ""}`}
      onClick={handleClick}
    >
      <img src={acceptIcon} alt="Modifier" width="20" height="20" />
    </button>
  );
};

export default Button_approve;
