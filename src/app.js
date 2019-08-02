import React from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./findpeople";
import Friends from "./friends";

export default function App() {
    const showUploader = useSelector(state => state.showUploader);
    return (
        <BrowserRouter>
            <div id="main-app">
                <header>
                    <img id="logo" src="/images/logo.png" alt="logo" />
                    <Link to="/">Home</Link>
                    <Link to="/users">Find People</Link>
                    <Link to="/friends">Friends</Link>
                    <Link to="/logout">Logout</Link>
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
        </BrowserRouter>
    );
} //closes App
