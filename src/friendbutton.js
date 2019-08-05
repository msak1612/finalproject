import React, { useState, useEffect } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import {
    setFriends,
    acceptFriend,
    endFriendship,
    cancelFriendship
} from "./actions";

function Button(props) {
    const [submit, error] = useFriendButtonSubmit(props);
    return (
        <div>
            {error && <div>Oops something happened!</div>}
            <button onClick={submit}>{props.text}</button>
        </div>
    );
}

function useFriendButtonSubmit(props) {
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    function submit() {
        axios
            .post(`/api/user/${props.id}`, {
                action: props.action
            })
            .then(({ data }) => {
                if (props.action === "accept") {
                    dispatch(acceptFriend(props.id));
                } else if (props.action === "end") {
                    dispatch(endFriendship(props.id));
                } else if (props.action === "cancel") {
                    dispatch(cancelFriendship(props.id));
                } else if (props.action === "send") {
                    dispatch(setFriends([data.friendshipStatus]));
                }
            })
            .catch(err => {
                setError(true);
                console.log("Error Message: ", err);
            });
    }
    return [submit, error];
} //closes useFriendButtonSubmit

export default function FriendButton(props) {
    const id = props.id;
    const friendship = useSelector(state =>
        state.friends.find(friend => friend.id == id)
    );
    let button;
    if (!friendship) {
        button = <Button id={id} action="send" text="Send Friend Request" />;
    } else {
        if (friendship.accepted) {
            button = <Button id={id} action="end" text="End Friendship" />;
        } else {
            if (friendship.sender_id == id) {
                button = (
                    <div className="display-rowwise">
                        <Button id={id} action="accept" text="Accept" />
                        <Button id={id} action="end" text="Reject" />
                    </div>
                );
            } else {
                button = (
                    <Button id={id} action="cancel" text="Cancel Invite" />
                );
            }
        }
    }
    return <div>{button}</div>;
} //closes FriendButton
