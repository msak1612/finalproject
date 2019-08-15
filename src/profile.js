import React from "react";
import BioEditor from "./bioeditor";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import { useSelector } from "react-redux";
import { Challenges } from "./challenges";
import { Collections } from "./collections";

export default function Profile() {
    const user = useSelector(state => state.user);
    const showUploader = useSelector(state => state.edit.showUploader);
    return (
        <div className="profile-container">
            <div className="display-colwise profile-left">
                <div
                    className="display-colwise"
                    id="main-pic"
                    style={{ maxWidth: "45vh", width: "35vh" }}
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
            </div>
            <div className="display-colwise profile-right"></div>
        </div>
    );
} //closes Profile
