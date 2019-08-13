import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { slide as Menu } from "react-burger-menu";
import { setSideBarVisibility } from "./actions";
import axios from "./axios";

export default function SideBar() {
    const dispatch = useDispatch();
    const sideBarVisible = useSelector(state => state.sideBar.visible);
    const request_count = useSelector(state => state.friends.request_count);
    const user = useSelector(state => state.user);

    function closeSideBar() {
        dispatch(setSideBarVisibility(false));
    }

    function handleSettingsClick() {} //closes handleSettingsClick

    function handleLogoutClick() {
        axios
            .get("/logout")
            .then(() => {
                closeSideBar();
                location.replace("/welcome");
            })
            .catch(err => {
                console.log(err);
            });
    } //closes handleLogoutClick

    function handleStateChange(state) {
        dispatch(setSideBarVisibility(state.isOpen));
    }

    return (
        <Menu
            className="menu"
            right
            width={"20%"}
            isOpen={sideBarVisible}
            onStateChange={state => handleStateChange(state)}
            noOverlay
        >
            <hr id="line1"></hr>
            <Link
                className="center"
                className="menu-item"
                to="/collections"
                onClick={closeSideBar}
            >
                Collections
            </Link>
            <hr id="line1"></hr>
            <Link
                id="friends"
                className="menu-item"
                to="/friends"
                onClick={closeSideBar}
            >
                Friends{" "}
                {request_count > 0 && (
                    <span className="count">{request_count}</span>
                )}
            </Link>
            <hr id="line1"></hr>
            <Link id="home" className="menu-item" to="/" onClick={closeSideBar}>
                Home
            </Link>
            <Link
                id="profile"
                className="menu-item"
                to="/profile"
                onClick={closeSideBar}
            >
                Your Profile
            </Link>
            <Link
                id="settings"
                className="menu-item"
                to="/settings"
                onClick={handleSettingsClick}
            >
                Settings
            </Link>
            <hr id="line1"></hr>
            <Link
                id="logout"
                className="menu-item"
                to="/logout"
                onClick={handleLogoutClick}
            >
                Sign Out
            </Link>
            <hr id="line1"></hr>
        </Menu>
    );
}
