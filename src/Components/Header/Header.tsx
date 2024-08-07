import { useRef, useState } from "react";
import cfia from "../../assets/CFIA_Banner.png";
import "./Header.css";
import { useTranslation } from "react-i18next";
import burgerMenu from "../../assets/burger-menu.svg";
import { MenuChannel } from "../../Utils/EventChannels";
const environment = {
  version: "0.1.0",
};

function Header() {
  const { t } = useTranslation();
  const header = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    flash(document.querySelector("#burger img") as HTMLElement);
    if (menuOpen) {
      MenuChannel.emit("CloseMenu");
      setMenuOpen(false);
    } else {
      MenuChannel.emit("OpenMenu");
      setMenuOpen(true);
    }
  }

  function flash(elem: HTMLElement) {
    elem.classList.add("flash");
    setTimeout(() => elem.classList.remove("flash"), 300);
  }

  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function myFunction() {
    // Get the offset position of the navbar
    const sticky = header.current!.offsetTop;
    if (window.scrollY > sticky) {
      header.current!.classList.add("sticky");
    } else {
      header.current!.classList.remove("sticky");
    }
  }

  // When the user scrolls the page, execute myFunction
  window.onscroll = function () {
    myFunction();
  };
  return (
    <header role={"banner"} ref={header} className="">
      <nav>
        <ul>
          <li id="burger">
            <a onClick={toggleMenu}>
              <img src={burgerMenu}></img>
            </a>
          </li>
          <li>
            <a
              href="https://inspection.canada.ca/"
              title={t("headerLinkTitle")}
            >
              <img
                src={cfia}
                id="header-img"
                alt={t("CFIALogo")}
                aria-label={t("textHeader")}
              />
            </a>
          </li>
          <li id="version">
            {t("headerAlphaVersionText")}{" "}
            {environment.version !== "" ? "v" + environment.version : ""}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
