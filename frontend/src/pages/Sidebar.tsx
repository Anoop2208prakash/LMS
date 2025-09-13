import React from "react";
import { NavLink } from "react-router-dom";
import "../assets/scss/sidebar.scss";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo"></div>
            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/dashboard" className="sidebar-link">
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/courses" className="sidebar-link">
                        Courses
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/students" className="sidebar-link">
                        Students
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/settings" className="sidebar-link">
                        Settings
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
}
