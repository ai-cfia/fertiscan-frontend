import cfia from "../../assets/CFIA_Banner.png";
import "./Header.css"
let environment = {
    "version":"0.0.1"
}

function Header(){
    return (
    <header role={"banner"}>
        <nav>
          <ul>
            <li>
              <a href="https://inspection.canada.ca/" title="ACIA | CFIA">
                <img
                  src={cfia}
                  alt="CFIA logo"
                  aria-label="Link to CFIA | Lien à l'ACIA"
                  style={{ height: 50 }}
                />
              </a>
            </li>
            <li id="version">Alpha Version { environment.version !== "" ? "v" + environment.version : ""}</li>
          </ul>
        </nav>
    </header>
    )
}

export default Header