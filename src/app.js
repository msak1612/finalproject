import React, { useEffect } from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { slide as Menu } from "react-burger-menu";

import ProfilePic from "./profilepic";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Settings from "./settings";
import Challenge from "./challenge";
import Challenges from "./challenges";
import Chatroom from "./chatroom";
import Collections from "./collections";
import axios from "./axios";
import { setUser } from "./actions";
import { init } from "./socket";

export default function App() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const request_count = useSelector(state => state.friends.request_count);

    useEffect(() => {
        axios
            .get("/user")
            .then(({ data }) => {
                dispatch(setUser(data));
                init();
            })
            .catch(err => {
                console.log(err);
            });
    }, [user.id]); //closes useEffect

    function handleLogoutClick() {
        axios
            .get("/logout")
            .then(() => {
                location.replace("/welcome");
            })
            .catch(err => {
                console.log(err);
            });
    } //closes handleLogoutClick

    function handleSettingsClick() {
        <Settings />;
    }

    function displayMenu() {}

    return (
        <BrowserRouter>
            {user.id && (
                <div id="main-app">
                    <img id="logo-s" src="/images/logo.png" alt="logo" />
                    <header>
                        <Link className="center" to="/challenges">
                            Challenges
                        </Link>
                        <Link className="center" to="/collections">
                            Collections
                        </Link>
                        <Link className="center" to="/forum">
                            Forum
                        </Link>

                        <Link className="center" to="/users">
                            Find People
                        </Link>
                        <Link className="center" to="/friends">
                            Friends
                            {request_count > 0 && (
                                <span className="count">{request_count}</span>
                            )}
                        </Link>
                        <Link className="center" to="/chatroom">
                            Chat
                        </Link>

                        <input
                            name="search"
                            type="text"
                            placeholder="Search Friend"
                            onChange={e => this.handleChange(e)}
                            required
                        />
                        <span>
                            <img
                                id="search"
                                src="/images/search.svg"
                                alt="search"
                            />
                        </span>
                        <span>
                            <img
                                id="notification"
                                src="/images/notification.svg"
                                alt="notification"
                            />
                        </span>
                        <ProfilePic />
                        <span className="header-name">
                            {user.first_name}&nbsp;{user.last_name}
                        </span>
                    </header>

                    <div id="outer-container">
                        <Menu
                            className="menu"
                            right
                            width={"20%"}
                            isOpen={false}
                            noOverlay
                            disableOverlayClick
                        >
                            <hr id="line1"></hr>
                            <Link
                                id="friends"
                                className="menu-item"
                                to="/friends"
                            >
                                Friends
                            </Link>
                            <hr id="line1"></hr>
                            <Link id="home" className="menu-item" to="/">
                                Home
                            </Link>
                            <Link
                                id="profile"
                                className="menu-item"
                                to="/profile"
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
                    </div>

                    <div>
                        <hr></hr>
                        <Route exact path="/" component={Profile} />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/users" component={FindPeople} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/collections" component={Collections} />
                        <Route path="/challenges" component={Challenges} />
                        <Route path="/challenge/:id" component={Challenge} />
                        <Route path="/chatroom" component={Chatroom} />
                    </div>
                </div>
            )}
        </BrowserRouter>
    );
} //closes App
