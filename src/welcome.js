//function component
import React from "react";
import { HashRouter, Route, Link, Switch } from "react-router-dom";
import Registration from "./registration";
import SignInInfo from "./signin-info";
import SignUpInfo from "./signup-info";
import Login from "./login";
export default function Welcome() {
    return (
        <HashRouter>
            <div>
                <img id="logo" src="/images/logo.png" alt="logo" />

                <div id="auth-container">
                    <Switch>
                        <Route exact path="/" component={Registration} />
                        <Route component={SignUpInfo} />
                    </Switch>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/" component={SignInInfo} />
                    </Switch>
                </div>
            </div>
        </HashRouter>
    );
} //closes Welcome
