import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pwd: "", pwd1: "", error: "" };
    } //closes constructor

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        if (
            event.target.name === "pwd1" &&
            (this.state.pwd.length < event.target.value.length ||
                (this.state.pwd.length === event.target.value.length &&
                    this.state.pwd != event.target.value))
        ) {
            this.setState({
                error: "Password mismatch"
            });
        }
    } //closes handleChange

    handleRegisterClick(event) {
        event.preventDefault();
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                pwd: btoa(this.state.pwd),
                email: this.state.email
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("Error Message: ", err);
            });
    } //closes handleRegisterClick

    render() {
        return (
            <div className="signup-container">
                <h2>Create Account</h2>
                {this.state.error && (
                    <div className="error">{this.state.error}</div>
                )}
                <input
                    name="first"
                    type="text"
                    placeholder="First name"
                    onChange={e => this.handleChange(e)}
                    required
                />
                <input
                    name="last"
                    type="text"
                    placeholder="Last name"
                    onChange={e => this.handleChange(e)}
                    required
                />
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
                <input
                    name="pwd1"
                    type="password"
                    placeholder="Retype password"
                    onChange={e => this.handleChange(e)}
                    required
                />
                <button
                    name="register"
                    onClick={e => this.handleRegisterClick(e)}
                >
                    Sign Up
                </button>
            </div>
        );
    } //closes render
} //closes Registration
