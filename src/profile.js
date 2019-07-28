import React from "react";
import BioEditor from "./bioeditor";

export default function Profile(props) {
    return (
        <div id="profile">
            {props.profilePic}
            {props.bioEditor}

            <div>
                {props.first}
                {props.last}
            </div>
            <BioEditor bio={props.bio} />
        </div>
    );
} //closes Profile
