import React from "react";
import { Link } from "react-router-dom";

export default function SignUpInfo() {
    return (
        <div id="overlay-container">
            <div id="overlay">
                <div className="panel right">
                    <h2>Hello, Friend!</h2>
                    <p>Enter your personal details and start journey with us</p>
                    <Link to="/">
                        <button className="ghost" id="signup">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
} //closes SignUpInfo
