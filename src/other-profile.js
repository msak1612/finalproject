import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sameUser: false
        };
    } //closes constructor

    async componentDidMount() {
        try {
            const id = this.props.match.params.id;
            const { data } = await axios.get(`/api/user/${id}`);
            console.log(data);
            this.setState(data);
            if (data.sameUser) {
                this.props.history.push("/");
            }
        } catch (err) {
            console.log("Error Message: ", err);
        }
    } //closes componentDidMount

    render() {
        return (
            <section style={{ display: "flex", flexDirection: "column" }}>
                {this.state.user && (
                    <div>
                        <img
                            src={this.state.user.profile_pic}
                            style={{
                                width: "30vh",
                                height: "30vh",
                                margin: "10px",
                                verticalAlign: "middle"
                            }}
                        />
                        <span style={{ fontWeight: "bold" }}>
                            {this.state.user.first_name} &nbsp;
                            {this.state.user.last_name}
                        </span>
                        <div>{this.state.user.bio}</div>
                        <FriendButton
                            friendshipStatus={this.state.friendshipStatus}
                            id={this.props.match.params.id}
                        />
                    </div>
                )}
                {!this.state.user && (
                    <div className="error">User not found!!!</div>
                )}
            </section>
        );
    } //closes render
} //closes OtherProfile
