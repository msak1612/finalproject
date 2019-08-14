import React, { useEffect } from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ProfilePic from "./profilepic";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Challenge from "./challenge";
import Challenges from "./challenges";
import Chatroom from "./chatroom";
import Collections from "./collections";
import SideBar from "./sidebar";
import Posts from "./posts";

import axios from "./axios";
import { setUser, setSideBarVisibility } from "./actions";
import { init } from "./socket";

export default function App() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

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

    function closeSideBar() {
        dispatch(setSideBarVisibility(false));
    }

    return (
        <BrowserRouter>
            {user.id && (
                <div id="main-app" onClick={closeSideBar}>
                    <img id="logo-s" src="/images/logo.png" alt="logo" />
                    <header>
                        <Link className="center" to="/challenges">
                            Challenges
                        </Link>
                        <Link className="center" to="/forum">
                            Forum
                        </Link>
                        <Link className="center" to="/chatroom">
                            Chat
                        </Link>
                        <Link to="/users">
                            <img id="search" src="/images/search.svg" />
                        </Link>
                        <Link to="/friends">
                            <img
                                id="notification"
                                src="/images/notification.svg"
                            />
                        </Link>
                        <ProfilePic />
                        <span className="header-name">
                            {user.first_name}&nbsp;{user.last_name}
                        </span>
                        <SideBar outerContainerId={"main-app"} />
                    </header>
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
                        <Route path="/forum" component={Posts} />
                    </div>
                </div>
            )}
        </BrowserRouter>
    );
} //closes App
