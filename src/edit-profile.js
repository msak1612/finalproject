import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {} from "./actions";
import axios from "./axios";

export default function EditProfile() {
    return (
        <section className="editProfile-container">
            <h2>Edit your Profile</h2>
            {this.state.error && (
                <div className="error">Provide valid input!</div>
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

            <button name="register" onClick={e => this.handleUpdateClick(e)}>
                Update
            </button>
        </section>
    );
} //closes EditProfile
