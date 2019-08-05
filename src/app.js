import React, { useEffect } from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ProfilePic from "./profilepic";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import axios from "./axios";
import { setUser } from "./actions";

export default function App() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        axios
            .get("/user")
            .then(({ data }) => {
                dispatch(setUser(data));
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
    }

    return (
        <BrowserRouter>
            {user.id && (
                <div id="main-app">
                    <header>
                        <img id="logo" src="/images/logo.png" alt="logo" />
                        <Link className="center" to="/">
                            Home
                        </Link>
                        <Link className="center" to="/users">
                            Find People
                        </Link>
                        <Link className="center" to="/friends">
                            Friends
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
                        <Route exact path="/" component={Profile} />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/users" component={FindPeople} />
                        <Route path="/friends" component={Friends} />
                    </div>
                </div>
            )}
        </BrowserRouter>
    );
} //closes App
