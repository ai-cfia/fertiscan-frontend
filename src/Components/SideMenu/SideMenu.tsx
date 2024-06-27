import "./SideMenu.css";
import { useTranslation } from "react-i18next";
import { MenuChannel } from "../../Utils/EventChannels";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import home from "../../assets/home.svg";
import settings from "../../assets/settings.svg";

function SideMenu() {
  const { t } = useTranslation();
  const SideMenuRef = useRef<HTMLDivElement | null>(null);
  MenuChannel.on("OpenMenu", () => {
    SideMenuRef.current!.classList.add("active");
  });
  MenuChannel.on("CloseMenu", () => {
    SideMenuRef.current!.classList.remove("active");
  });
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };
  const goToSettings = () => {
    navigate("/Settings");
  };

  return (
    <div className="side-menu" ref={SideMenuRef}>
      <div className="side-menu_content">
        <ul>
          <li>
            {" "}
            <a className="side-menu_item" onClick={goToHome}>
              <img className="menu-icon" src={home}></img>{" "}
              <span>{t("Home")}</span>
            </a>{" "}
          </li>
          <li>
            {" "}
            <a className="side-menu_item" onClick={goToSettings}>
              <img className="menu-icon" src={settings}></img>{" "}
              <span>{t("Settings")}</span>
            </a>{" "}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideMenu;
