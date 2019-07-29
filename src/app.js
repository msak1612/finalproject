import React from "react";
import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import Profile from "./profile";
import axios from "./axios";
import { Route, BrowserRouter } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        };
    } //closes constructor

    async componentDidMount() {
        const { data } = await axios.get("/user");
        this.setState(data);
    } //closes componentDidMount

    render() {
        console.log("ID: ", this.state.id);
        if (!this.state.id) {
            return null;
        }
        return (
            <div id="main-app">
                <header>
                    <img id="logo" src="/images/logo.png" alt="logo" />{" "}
                    <ProfilePic
                        image={this.state.profile_pic}
                        first={this.state.first_name}
                        last={this.state.last_name}
                    />
                </header>
                <Profile
                    bio={this.state.bio}
                    first={this.state.first_name}
                    last={this.state.last_name}
                    profilePic={
                        <ProfilePic
                            image={this.state.profile_pic}
                            first={this.state.first_name}
                            last={this.state.last_name}
                            onClick={() =>
                                this.setState({ uploaderIsVisible: true })
                            }
                        />
                    }
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        done={image => this.setState({ image })}
                        onUpload={imageUrl => {
                            this.setState({ profile_pic: imageUrl });
                            this.setState({ uploaderIsVisible: false });
                        }}
                        onCancel={() => {
                            this.setState({ uploaderIsVisible: false });
                        }}
                    />
                )}
            </div>
        );
    } //closes render
} //closes App
