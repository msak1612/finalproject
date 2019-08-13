//function component
import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Registration from "./registration";
import SignInInfo from "./signin-info";
import SignUpInfo from "./signup-info";
import Login from "./login";
export default function Welcome() {
    return (
        <HashRouter>
            <div>
                <h1>
                    <img id="logo" src="/images/logo.png" alt="logo" />
                    Code Grounds
                </h1>

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
