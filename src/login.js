import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    } //closes constructor

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    } //closes handleChange

    handleLoginClick(event) {
        event.preventDefault();
        axios
            .post("/login", {
                login: this.state.email,
                pwd: btoa(this.state.pwd)
            })
            .then(({ status }) => {
                if (status == 200) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    } //closes handleLoginClick

    render() {
        return (
            <div className="signin-container">
                <h2>Sign in</h2>
                {this.state.error && (
                    <div className="error">
                        Something went wrong. Please try again!
                    </div>
                )}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={e => this.handleChange(e)}
                    required
                />
                <input
                    name="pwd"
                    type="password"
                    placeholder="Password"
                    onChange={e => this.handleChange(e)}
                    required
                />

                <button name="login" onClick={e => this.handleLoginClick(e)}>
                    Sign In
                </button>
            </div>
        );
    } //closes render
} //closes Login
