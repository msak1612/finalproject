import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: this.props.bio,
            draftBio: "",
            editing: false,
            bioAvailable: false
        };
    } //closes constructor

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    } //closes handleChange

    handleSaveClick() {
        axios
            .post("/bio", {
                bio: this.state.draftBio
            })
            .then(({ data }) => {
                console.log(data);
                this.setState({ editing: false });
                this.setState({ bio: data.bio });
            })
            .catch(err => {
                console.log(err);
                this.setState({ editing: false });
            });
    } //closes handleSaveClick

    render() {
        let button;

        if (this.state.bio) {
            button = (
                <button onClick={e => this.setState({ editing: true })}>
                    Edit
                </button>
            );
        } else {
            button = (
                <button onClick={e => this.setState({ editing: true })}>
                    Add Bio
                </button>
            );
        }
        return (
            <div id="biocontainer">
                {!this.state.editing && (
                    <span>
                        <i>{this.state.bio}</i>
                    </span>
                )}
                {this.state.editing && (
                    <div id="bioeditor">
                        <p>Add a short bio to tell more about yourself.</p>
                        <textarea
                            rows="10"
                            name="draftBio"
                            defaultValue={this.state.bio}
                            placeholder="Describe who you are"
                            onChange={e => this.handleChange(e)}
                        ></textarea>
                        <div id="bio-btn">
                            <button
                                name="save"
                                onClick={e => this.handleSaveClick(e)}
                            >
                                Save
                            </button>
                            <button
                                name="cancel"
                                onClick={e => this.setState({ editing: false })}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                {!this.state.editing && button}
            </div>
        );
    } //closes render
} //closes BioEditor
