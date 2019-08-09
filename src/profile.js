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
                id="main-pic"
                style={{ maxWidth: "45vh", width: "45vh" }}
            >
                <ProfilePic upload="true" />
                <div className="profile-info">
                    <span className="profile-name">
                        {user.first_name}&nbsp;{user.last_name}
                        <hr id="line"></hr>
                    </span>

                    <BioEditor bio={user.bio} />
                    {showUploader && <Uploader />}
                </div>
            </div>
            <Posts className="post" id={user.id} />
        </div>
    );
} //closes Profile
