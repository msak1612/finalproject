import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { showUploader } from "./actions";

export default function ProfilePic(props) {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    let pic = (user && user.profile_pic) || "/images/default.png";
    let image;

    if (!props.upload) {
        image = (
            <img
                id="profile-pic"
                src={pic}
                alt={`${user.first_name} ${user.last_name}`}
            />
        );
    } else {
        image = (
            <img
                id="profile-pic"
                src={pic}
                alt={`${user.first_name} ${user.last_name}`}
                onClick={() => dispatch(showUploader(true))}
            />
        );
    }
    return image;
}

//size
//width
