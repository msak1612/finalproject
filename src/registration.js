import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

//one component per file - always export default,
//Registration is class component - needs state
export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pwd: "", pwd1: "", error: "" };
        this.handleRegisterClick = this.handleRegisterClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    } //closes constructor

    // componentDidMount() {
    //     axios.get("/register").then(response => {
    //         this.setState({
    //             first: response.data.first,
    //             last: response.data.last,
    //             email: response.data.email,
    //             pwd: response.data.pwd
    //         });
    //     });
    // } //closes componentDidMount

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
    } //closes handleClick
    //single page - logged in & Registration - single page.. switch between these components.
    //add this in index.js

    render() {
        return (
            <div>
                {this.state.error && (
                    <div className="error">{this.state.error}</div>
                )}
                <label htmlFor="first">First Name</label>
                <input
                    name="first"
                    type="text"
                    placeholder="first name"
                    onChange={this.handleChange}
                    required
                />
                <label htmlFor="last">Last Name</label>
                <input
                    name="last"
                    type="text"
                    placeholder="last name"
                    onChange={this.handleChange}
                    required
                />
                <label htmlFor="email">Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="email"
                    onChange={this.handleChange}
                    required
                />
                <label htmlFor="pwd">Password</label>
                <input
                    name="pwd"
                    type="password"
                    placeholder="password"
                    onChange={this.handleChange}
                    required
                />
                <label htmlFor="pwd1">Re-enter Password</label>
                <input
                    name="pwd1"
                    type="password"
                    placeholder="Enter password again"
                    onChange={this.handleChange}
                    required
                />
                <button name="register" onClick={this.handleRegisterClick}>
                    Register
                </button>
            </div>
        );
    } //closes render
} //closes Registration

//<button onClick={e => this.submit(e)}>Register</button>
