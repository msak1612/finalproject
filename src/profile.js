import React from "react";
import BioEditor from "./bioeditor";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import { useSelector } from "react-redux";
import { Posts } from "./posts";

export default function Profile() {
    const user = useSelector(state => state.user);
    const showUploader = useSelector(state => state.edit.showUploader);

    return (
        <div className="display-rowwise">
            <div
                className="display-colwise"
                style={{ maxWidth: "35vh", width: "35vh" }}
            >
                <ProfilePic upload="true" />
                <div className="profile-info">
                    <span className="profile-name">
                        {user.first_name}&nbsp;{user.last_name}
                    </span>
                    <BioEditor bio={user.bio} />
                    {showUploader && <Uploader />}
                </div>
            </div>
            <Posts id={user.id} />
        </div>
    );
} //closes Profile
