import { useState } from "react";
import "./Button_modify.css"; // Import your CSS file
import editIcon from "../../assets/edit1.svg";

const Button_modify = () => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 400);
  };

  return (
    <button
      className={`button ${isActive ? "active" : ""}`}
      onClick={handleClick}
    >
      <img src={editIcon} alt="Modifier" width="20" height="20" />
    </button>
  );
};

export default Button_modify;
