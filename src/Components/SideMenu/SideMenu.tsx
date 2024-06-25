import "./SideMenu.css";


function SideMenu() {

    return (
        <div className="side-menu">
            <div className="side-menu__header">
                <div className="side-menu__header__logo">
                    <img src="https://www.fertiscan.com/wp-content/uploads/2021/02/logo.png" alt="Fertiscan Logo" />
                </div>
                <div className="side-menu__header__title">
                    <h1>Fertiscan</h1>
                </div>
            </div>
            <div className="side-menu__content">
                <ul>
                    <li>Home</li>
                    <li>Dashboard</li>
                    <li>Reports</li>
                    <li>Settings</li>
                </ul>
            </div>
        </div>
    );
}


export default SideMenu;