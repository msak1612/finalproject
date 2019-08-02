import React from "react";
import BioEditor from "./bioeditor";
import ProfilePic from "./profilepic";
import { useSelector } from "react-redux";

export default function Profile(props) {
    const user = useSelector(state => state.user);

    return (
        <div id="profile-container">
            <div className="profile">
                <ProfilePic upload="true" />
                <div id="profile-info">
                    <span id="profile-name">
                        {user.first_name}&nbsp;{user.last_name}
                    </span>
                    <BioEditor bio={user.bio} />
                </div>
            </div>
        </div>
    );
} //closes Profile
