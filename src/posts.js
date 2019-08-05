import React, { useEffect } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function Posts(props) {
    const id = props.id;
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts);
    const url = "/api/posts/" + id;

    useEffect(() => {
        /*TODO: axios.get(....)*/
    }, [url]); //closes useEffect

    return (
        <div></div>
        /*TODO:*/
    );
}
