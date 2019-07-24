//function component
import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export default function Welcome() {
    return (
        <div>
            <h1>Welcome to WAT Community (Where Are They)</h1>
            <img src="/images/logo.png" alt="logo" />
            <p>
                It's a social networking application for communicating with your
                family and friends.
            </p>
            <HashRouter>
                <div>
                    <p>Join the Mission!</p>
                    <Route exact path="/" component={Registration} />
                    <p>
                        If already a member? Click here to
                        <Link to="/login"> Login</Link>
                    </p>
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
// welcome#/ welcome#login->
