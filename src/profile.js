import React from "react";
import BioEditor from "./bioeditor";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    } //closes constructor

    render() {
        return (
            <div id="profile-container">
                <div className="profile">
                    {this.props.profilePic}
                    <div id="profile-info">
                        <span id="profile-name">
                            {this.props.first}&nbsp;{this.props.last}
                        </span>
                        <BioEditor bio={this.props.bio} />
                    </div>
                </div>
            </div>
        );
    } //closes render
} //closes Profile
