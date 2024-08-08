import "./SideMenu.css";
import { useTranslation } from "react-i18next";
import { MenuChannel } from "../../Utils/EventChannels";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import home from "../../assets/home.svg";
import settings from "../../assets/settings.svg";
import list from "../../assets/list.svg";
import { SessionContext, SetSessionContext } from "../../Utils/SessionContext";
import Data from "../../Model/Data-Model";

function SideMenu() {
  const { t } = useTranslation();
  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);
  const SideMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const saveState = () => {
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
  };

  const retrieveState = () => {
    switch (state.state) {
      case "FromCapture":
        setState({ ...state, state: "capture" });
        break;
      case "FromForm":
        setState({ ...state, state: "form" });
        break;
      case "FromValidation":
        setState({ ...state, state: "validation" });
        break;
      default:
        setState({
          state: "capture",
          data: { pics: [], form: new Data([]) },
        });
    }
  };

  const goToHome = () => {
    retrieveState();
    navigate("/");
  };

  const goToSettings = () => {
    saveState();
    navigate("/Settings");
  };
  const goToSavedList = () => {
    saveState();
    navigate("/Saved");
  };

  MenuChannel.on("OpenMenu", () => {
    SideMenuRef.current!.classList.add("active");
  });
  MenuChannel.on("CloseMenu", () => {
    SideMenuRef.current!.classList.remove("active");
  });

  return (
    <div className="side-menu notAffectedTopPadding" ref={SideMenuRef}>
      <div className="side-menu_content">
        <ul>
          <li>
            {" "}
            <a className="side-menu_item" onClick={goToHome}>
              <img alt="home icon" className="menu-icon" src={home}></img>{" "}
              <span>{t("home")}</span>
            </a>{" "}
          </li>
          <li>
            {" "}
            <a className="side-menu_item" onClick={goToSavedList}>
              <img alt="list icon" className="menu-icon" src={list}></img>{" "}
              <span>savedList</span>
            </a>{" "}
          </li>
          <li>
            {" "}
            <a className="side-menu_item" onClick={goToSettings}>
              <img
                alt="setting icon"
                className="menu-icon"
                src={settings}
              ></img>{" "}
              <span>{t("settings")}</span>
            </a>{" "}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideMenu;
