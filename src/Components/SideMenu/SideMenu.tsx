import "./SideMenu.css";
import { useTranslation } from "react-i18next";
import { MenuChannel } from "../../Utils/EventChannels";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import home from "../../assets/home.svg";
import settings from "../../assets/settings.svg";
import { SessionContext, SetSessionContext } from "../../Utils/SessionContext";
import Data from "../../Model/Data-Model";

function SideMenu() {
  const { t } = useTranslation();
  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);
  const SideMenuRef = useRef<HTMLDivElement | null>(null);
  MenuChannel.on("OpenMenu", () => {
    SideMenuRef.current!.classList.add("active");
  });
  MenuChannel.on("CloseMenu", () => {
    SideMenuRef.current!.classList.remove("active");
  });
  const navigate = useNavigate();
  const goToHome = () => {
    console.log(state.state);
    switch (state.state) {
      case "FromCaptur":
        setState({ ...state, state: "captur" });
        break;
      case "FromForm":
        setState({ ...state, state: "form" });
        break;
      case "FromValidation":
        setState({ ...state, state: "validation" });
        break;
      default:
        console.log("default");
        setState({
          state: "captur",
          data: { pics: [], form: new Data([]) },
        });
        console.log(state);
    }
    navigate("/");
  };
  const goToSettings = () => {
    console.log(state.state);
    switch (state.state) {
      case "captur":
        setState({ ...state, state: "FromCaptur" });
        break;
      case "form":
        setState({ ...state, state: "FromForm" });
        break;
      case "validation":
        setState({ ...state, state: "FromValidation" });
        break;
      default:
        break;
    }
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
              <span>{t("home")}</span>
            </a>{" "}
          </li>
          <li>
            {" "}
            <a className="side-menu_item" onClick={goToSettings}>
              <img className="menu-icon" src={settings}></img>{" "}
              <span>{t("settings")}</span>
            </a>{" "}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideMenu;
