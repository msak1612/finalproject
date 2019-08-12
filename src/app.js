import React, { useEffect } from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { slide as Menu } from "react-burger-menu";

import ProfilePic from "./profilepic";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./findpeople";
import Friends from "./friends";
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

    function handleDeleteClick() {
        axios
            .get("/delete")
            .then(() => {
                location.replace("/welcome");
            })
            .catch(err => {
                console.log(err);
            });
    } //closes handleDeleteClick

    function displayMenu() {}

    return (
        <BrowserRouter>
            {user.id && (
                <div id="main-app">
                    <img id="logo-s" src="/images/logo.png" alt="logo" />
                    <header>
                        <Link className="center" to="/">
                            Home
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
                        <Link className="center" to="/challenges">
                            Challenges
                        </Link>
                        <Link className="center" to="/collections">
                            Collections
                        </Link>
                        <Link
                            className="center"
                            to="/delete"
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </Link>
                        <Link
                            className="center"
                            to="/logout"
                            onClick={handleLogoutClick}
                        >
                            Logout
                        </Link>
                        <ProfilePic />
                    </header>

                    <div>
                        <Menu right>
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
                                id="friends"
                                className="menu-item"
                                to="/friends"
                            >
                                Friends
                            </Link>
                            <Link
                                id="settings"
                                className="menu-item"
                                to="/settings"
                            >
                                Settings
                            </Link>
                            <Link
                                id="logout"
                                className="menu-item"
                                to="/logout"
                            >
                                Logout
                            </Link>
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
