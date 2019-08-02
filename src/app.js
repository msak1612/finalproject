import React, { useEffect } from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Uploader from "./uploader";
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
    const showUploader = useSelector(state => state.showUploader);

    useEffect(() => {
        axios
            .get("/user")
            .then(({ data }) => {
                console.log(data);
                dispatch(setUser(data));
            })
            .catch(err => {
                console.log(err);
            });
    }, [user.id]); //closes useEffect

    return (
        <BrowserRouter>
            {user.id && (
                <div id="main-app">
                    <header>
                        <img id="logo" src="/images/logo.png" alt="logo" />
                        <Link to="/">Home</Link>
                        <Link to="/users">Find People</Link>
                        <Link to="/friends">Friends</Link>
                        <a href="/logout">Logout</a>
                        <ProfilePic />
                    </header>
                    <div>
                        <Route exact path="/" component={Profile} />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/users" component={FindPeople} />
                        <Route path="/friends" component={Friends} />
                    </div>
                    {showUploader && <Uploader />}
                </div>
            )}
        </BrowserRouter>
    );
} //closes App
