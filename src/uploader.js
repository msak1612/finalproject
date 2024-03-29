import React from "react";
import axios from "./axios";
import { saveProfilePic, fileToUpload, showUploader } from "./actions";
import { useDispatch, useSelector } from "react-redux";

export default function Uploader() {
    const dispatch = useDispatch();
    const file = useSelector(state => state.edit.fileToUpload);
    function handleChange(event) {
        dispatch(fileToUpload(event.target.files[0]));
    } //handleChange

    function handleUploadClick(event) {
        event.preventDefault();
        var formData = new FormData();
        formData.append("file", file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                if (data.image) {
                    //to show profile pic
                    console.log(data.image);
                    dispatch(saveProfilePic(data.image));
                    dispatch(showUploader(false));
                }
            })
            .catch(err => {
                console.log("Error Message: ", err);
            });
    } //handleUploadClick

    return (
        <div className="modal-container">
            <label>
                Update Profile Picture <hr id="line"></hr>
                <input
                    type="file"
                    name="file"
                    onChange={e => handleChange(e)}
                />
            </label>
            <div>
                <button type="upload" onClick={e => handleUploadClick(e)}>
                    Upload
                </button>
                <button
                    type="cancel"
                    onClick={() => dispatch(showUploader(false))}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
} //closes Uploader
