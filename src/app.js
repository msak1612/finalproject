import React, { useEffect } from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ProfilePic from "./profilepic";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Chatroom from "./chatroom";
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
                        <hr></hr>
                        <Route exact path="/" component={Profile} />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/users" component={FindPeople} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/chatroom" component={Chatroom} />
                    </div>
                </div>
            )}
        </BrowserRouter>
    );
} //closes App
