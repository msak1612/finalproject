import React from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { draftBio, saveBio, showBio } from "./actions";

export default function BioEditor() {
    let button;
    const draft = useSelector(state => state.edit.draftBio);
    const bio = useSelector(state => state.user.bio);
    const editing = !useSelector(state => state.edit.showBio);
    const dispatch = useDispatch();
    if (bio) {
        button = (
            <div>
                <div id="biocontainer">
                    <span>
                        <i>{bio}</i>
                    </span>
                </div>
                <button onClick={() => dispatch(showBio(false))}>Edit</button>
            </div>
        );
    } else {
        button = (
            <div>
                <div id="biocontainer">
                    <h4>Add a short bio to tell more about yourself.</h4>
                </div>
                <button onClick={() => dispatch(showBio(false))}>
                    Add Bio
                </button>
            </div>
        );
    }

    function handleChange(event) {
        dispatch(draftBio(event.target.value));
    } //closes handleChange

    function handleSaveClick() {
        axios
            .post("/bio", {
                bio: draft
            })
            .then(() => {
                dispatch(showBio(true));
                dispatch(saveBio(draft));
            })
            .catch(err => {
                console.log(err);
                dispatch(showBio(true));
            });
    } //closes handleSaveClick

    return (
        <div>
            {editing && (
                <div id="bioeditor">
                    <textarea
                        rows="10"
                        name="draftBio"
                        defaultValue={bio}
                        placeholder="Describe who you are"
                        onChange={e => handleChange(e)}
                    ></textarea>
                    <div id="bio-btn">
                        <button name="save" onClick={() => handleSaveClick()}>
                            Save
                        </button>
                        <button
                            name="cancel"
                            onClick={() => dispatch(showBio(true))}
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
