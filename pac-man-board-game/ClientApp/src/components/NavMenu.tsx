import React from "react";
import {Link} from "react-router-dom";

export const NavMenu = () => {

    const [collapsed, setCollapsed] = React.useState(true);

    function toggleNavbar() {
        setCollapsed(!collapsed);
    }

    return (
        <header>
            <nav className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3">
                <Link to="/">Pac-Man Board Game</Link>
                <div onClick={toggleNavbar} className="mr-2"/>
                <div className="d-sm-inline-flex flex-sm-row-reverse">
                    <ul className="navbar-nav flex-grow">
                            <Link className="text-dark" to="/">Home</Link>
                            <Link className="text-dark" to="/counter">Counter</Link>
                    </ul>
                </div>
            </nav>
        </header>
    );
};
