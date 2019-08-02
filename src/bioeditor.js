import React, { useCallback } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { showBio, updateBio } from "./reducers";

export default function BioEditor() {
    let button;
    const bio = useSelector(state => state.user.bio);
    const editing = !useSelector(state => state.showBio);
    const dispatch = useDispatch();
    if (bio) {
        button = (
            <button
                onClick={() => dispatch({ type: "SHOW_BIO", visible: false })}
            >
                Edit
            </button>
        );
    } else {
        button = (
            <button
                onClick={() => dispatch({ type: "SHOW_BIO", visible: false })}
            >
                Add Bio
            </button>
        );
    }
    return (
        <div id="biocontainer">
            {!editing && (
                <span>
                    <i>{bio}</i>
                </span>
            )}
            {editing && (
                <div id="bioeditor">
                    <p>Add a short bio to tell more about yourself.</p>
                    <textarea
                        rows="10"
                        name="draftBio"
                        defaultValue={bio}
                        placeholder="Describe who you are"
                    ></textarea>
                    <div id="bio-btn">
                        <button name="save">Save</button>
                        <button
                            name="cancel"
                            onClick={() =>
                                dispatch({ type: "SHOW_BIO", visible: true })
                            }
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {!editing && button}
        </div>
    );
} //closes BioEditor
