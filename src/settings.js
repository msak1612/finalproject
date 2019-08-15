import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./actions";

import axios from "./axios";
import { init } from "./socket";

export default function Settings() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        axios
            .get("/user")
            .then(({ data }) => {
                dispatch(setUser(data));
                init();
            })
            .catch(err => {
                console.log(err);
            });
    }, [user.id]); //closes useEffect

    function handleDeleteClick() {
        axios
            .get("/delete")
            .then(() => {
                location.replace("/welcome");
            })
            .catch(err => {
                console.log(err);
            });
    } //closes handleDeleteClick

    return (
        <div>
            <h2>Settings</h2>
            <h3>Delete Account</h3>
            <div className="display-rowwise">
                <p>
                    It is a pleasure having you here. Do you really want to
                    delete?
                </p>
                <Link
                    className="center"
                    to="/delete"
                    onClick={handleDeleteClick}
                >
                    Delete Account
                </Link>
                <Link className="center" to="/">
                    Cancel
                </Link>
            </div>
        </div>
    );
} //closes Settings
