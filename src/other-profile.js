import React, { useEffect } from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUser, setFriendshipStatus } from "./actions";

export default function OtherProfile(props) {
    const id = props.match.params.id;
    const dispatch = useDispatch();
    const otherUser = useSelector(state => state.otherUser);
    const url = "/api/user/" + id;

    useEffect(() => {
        axios
            .get(url)
            .then(({ data }) => {
                if (data.sameUser) {
                    props.history.push("/");
                }
                dispatch(setOtherUser(data.user, data.friendshipStatus));
            })
            .catch(err => {
                console.log(err);
            });
    }, [url]); //closes useEffect

    return (
        <section style={{ display: "flex", flexDirection: "column" }}>
            {otherUser && (
                <div>
                    <img
                        src={otherUser.profile_pic}
                        style={{
                            width: "30vh",
                            height: "30vh",
                            margin: "10px",
                            verticalAlign: "middle"
                        }}
                    />
                    <span style={{ fontWeight: "bold" }}>
                        {otherUser.first_name} &nbsp;
                        {otherUser.last_name}
                    </span>
                    <div>{otherUser.bio}</div>
                    <FriendButton />
                </div>
            )}
            {!otherUser && <div className="error">User not found!!!</div>}
        </section>
    );
} //closes OtherProfile
