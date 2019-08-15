import React, { useEffect } from "react";
import BioEditor from "./bioeditor";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import { useSelector, useDispatch } from "react-redux";
import Challenges from "./challenges";
import Collections from "./collections";
import { setCurrentTab } from "./actions";

export default function Profile() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const showUploader = useSelector(state => state.edit.showUploader);
    const currentTab = useSelector(state => state.challenges.currentTab);

    useEffect(() => {
        dispatch(setCurrentTab("solved"));
    }, [true]); //closes useEffect

    function handleTabClick(e) {
        dispatch(setCurrentTab(e.target.id));
    }

    function TabButton(props) {
        return (
            <button
                className={
                    currentTab == props.id ? "activetablink" : "inactivetablink"
                }
                id={props.id}
                onClick={e => handleTabClick(e)}
            >
                {props.text}
            </button>
        );
    }

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
                        <span>
                            <hr id="line"></hr>
                        </span>
                        <h4>{user.score} XP</h4>
                        <span>
                            <hr id="line"></hr>
                        </span>
                    </div>
                </div>
            </div>
            <div className="display-colwise profile-right">
                <div className="tab">
                    <TabButton id="solved" text="Completed" />
                    <TabButton id="collections" text="Collections" />
                </div>
                {currentTab == "solved" && <Challenges solved="true" />}
                {currentTab == "collections" && <Collections />}
            </div>
        </div>
    );
} //closes Profile
