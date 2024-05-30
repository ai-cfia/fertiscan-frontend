import cfia from "../../assets/CFIA_Banner.png";
import "./Header.css";
import { useTranslation } from 'react-i18next';
const environment = {
  version: "0.0.1",
};

function Header() {
  const { t } = useTranslation();
  return (
    <header role={"banner"}>
      <nav>
        <ul>
          <li>
            <a href="https://inspection.canada.ca/" title={t("title_link")}>
              <img
                src={cfia}
                id="header-img"
                alt={t("logo")}
                aria-label="Link to CFIA | Lien à l'ACIA" // not sure if i need to make the traduction here.
              />
            </a>
          </li>
          <li id="version">
            {t("Version")}{" "}
            {environment.version !== "" ? "v" + environment.version : ""}
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
