//function component
import React from "react";
import Registration from "./registration";

export default function Welcome() {
    return (
        <div>
            <p>Welcome to WAT (Where Are They)</p>

            <p>
                It's a social networking application for communicating with your
                family and friends.
            </p>
            <div>Join Our Mission!</div>
            <Registration />
            <p>
                If already a member? Please <a href="./login">Log in</a> here.
            </p>
        </div>
    );
}
