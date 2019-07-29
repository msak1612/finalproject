import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    } //closes constructor

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.files[0]
        });
    } //handleChange

    handleUploadClick(event) {
        event.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                if (data.image) {
                    //to show profile pic
                    console.log(data.image);
                    this.props.onUpload(data.image);
                }
            })
            .catch(err => {
                console.log("Error Message: ", err);
            });
    } //handleUploadClick

    handleCancelClick(event) {
        event.preventDefault();
        this.props.onCancel();
    }
    render() {
        return (
            <div id="upload-container">
                <label>
                    Upload file
                    <input
                        type="file"
                        name="file"
                        onChange={e => this.handleChange(e)}
                    />
                </label>
                <button type="upload" onClick={e => this.handleUploadClick(e)}>
                    Upload
                </button>
                <button type="cancel" onClick={e => this.handleCancelClick(e)}>
                    Cancel
                </button>
            </div>
        );
    } //closes render
} //closes Uploader
