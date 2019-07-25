import React from "react";
import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import axios from "./axios";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        };
    } //closes constructor

    async componentDidMount() {
        const { data } = await axios.get("/user"); //do GET /user in server - db query to user info
        this.setState(data);
    } //closes componentDidMount

    render() {
        console.log("ID: ", this.state.id);
        if (!this.state.id) {
            return null;
        }
        return (
            <div>
                <img src="/images/group.png" alt="WAT Now" />
                <ProfilePic
                    image={this.state.profile_pic}
                    first={this.state.first}
                    last={this.state.last}
                    onClick={() => this.setState({ uploaderIsVisible: true })}
                />

                {this.state.uploaderIsVisible && (
                    <Uploader
                        done={image => this.setState({ image })}
                        onUpload={imageUrl => {
                            this.setState({ profile_pic: imageUrl });
                            this.setState({ uploaderIsVisible: false });
                        }}
                    />
                )}
            </div>
        );
    } //closes render
} //closes App
