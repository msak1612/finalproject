import React from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { draftBio, saveBio, showBio } from "./actions";

export default function BioEditor() {
    let button;
    const draft = useSelector(state => state.draftBio);
    const bio = useSelector(state => state.user.bio);
    const editing = !useSelector(state => state.showBio);
    const dispatch = useDispatch();
    if (bio) {
        button = <button onClick={() => dispatch(showBio(false))}>Edit</button>;
    } else {
        button = (
            <button onClick={() => dispatch(showBio(false))}>Add Bio</button>
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
            .then(({ data }) => {
                console.log(data);
                dispatch(showBio(false));
                dispatch(saveBio(draft));
            })
            .catch(err => {
                console.log(err);
                dispatch(showBio(false));
            });
    } //closes handleSaveClick

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
