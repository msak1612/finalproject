import React from "react";
import { Link } from "react-router-dom";

export default function SignInInfo() {
    return (
        <div id="overlay-container">
            <div id="overlay">
                <div className="panel right">
                    <h2>Welcome Back!</h2>
                    <p>
                        To keep connected with us please login with your
                        personal info
                    </p>
                    <Link to="/login">
                        <button className="ghost" id="signin">
                            Sign In
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
} //closes SignInInfo
