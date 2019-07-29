import React from "react";
import axios from "./axios";

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
            this.setState({ user: data.user, sameUser: data.sameUser });
            if (data.sameUser) {
                this.props.history.push("/");
            }
        } catch (err) {
            console.log("error: ", err);
        }
    } //closes componentDidMount

    render() {
        return (
            <div>
                {this.state.user && (
                    <div>
                        <img src={this.state.user.profile_pic} />
                        {this.state.user.first_name} &nbsp;
                        {this.state.user.last_name}
                        {this.state.user.bio}
                    </div>
                )}
                {!this.state.user && (
                    <div className="error">User not found!!!</div>
                )}
            </div>
        );
    } //closes render
} //closes OtherProfile
