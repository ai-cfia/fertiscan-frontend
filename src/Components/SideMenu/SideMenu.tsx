import "./SideMenu.css";
import { useTranslation } from "react-i18next";
import home from "../../assets/home.svg";

function SideMenu() {
  const { t } = useTranslation();

  return (
    <div className="side-menu">
      <div className="side-menu__content">
        <ul>
          <li>
            {" "}
            <img className="menu-icon" src={home}></img>{" "}
            {false ? t("Home") : ""}{" "}
          </li>
          <li>
            {" "}
            <i></i> {t("Settings")}{" "}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideMenu;
