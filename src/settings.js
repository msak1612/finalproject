import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function Settings() {
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
        <section>
            <Link className="center" to="/delete" onClick={handleDeleteClick}>
                Delete
            </Link>
        </section>
    );
} //closes Settings
