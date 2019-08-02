import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { showUploader } from "./reducers";

export default function ProfilePic() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    let image = (user && user.profile_pic) || "/images/default.png";
    return (
        <img
            id="profile-pic"
            src={image}
            alt={`${user.first_name} ${user.last_name}`}
            onClick={() =>
                dispatch({
                    showUploader
                })
            }
        />
    );
}
