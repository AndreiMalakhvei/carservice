import {NavLink} from "react-router-dom";

const Header = () => {

    return (
        <nav>
            <ul className="menu">
                <li className="menu-element">
                    <NavLink to='/home' className="navbar-text" href="#">Home</NavLink>
                </li>
                <li className="menu-element">
                     <NavLink to='/home' className="navbar-text" href="#">New Order</NavLink>
                </li>
                <li className="menu-element">
                     <a className="navbar-text" href="#">Reports</a>
                    <ul className="sub-menu">
                        <li><NavLink to='/query/1' className="navbar-dropdowntext" href="#">1st Request</NavLink></li>
                        <li><NavLink to='/query/2' className="navbar-dropdowntext" href="#">2nd Request</NavLink></li>
                        <li><NavLink to='/query/3' className="navbar-dropdowntext" href="#">3rd Request</NavLink></li>
                        <li><NavLink to='/query/4' className="navbar-dropdowntext" href="#">4th Request</NavLink></li>
                    </ul>
                </li>
                <li className="menu-element">
                     <a className="navbar-text" href="#">LogIn</a>
                </li>
            </ul>
        </nav>
    );
};

export default Header;