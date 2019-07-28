import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        if (this.props.bio) {
            button = (
                <button onClick={e => this.setState({ editing: true })}>
                    Edit
                </button>
            );
        } else {
            button = (
                <button onClick={e => this.setState({ editing: true })}>
                    Add
                </button>
            );
        }
        return (
            <div>
                {this.state.editing && (
                    <div>
                        <textarea
                            name="draftBio"
                            onChange={e => this.handleChange(e)}
                        ></textarea>
                        <button onClick={e => this.handleSaveClick(e)}>
                            Save
                        </button>
                    </div> //more to Edit
                )}
                {!this.state.editing && button}
            </div>
        );
    } //closes render
} //closes BioEditor
