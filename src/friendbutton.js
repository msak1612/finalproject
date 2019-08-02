import React, { useState, useEffect } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { setFriendshipStatus } from "./actions";

function SendButton() {
    const [submit, error] = useFriendButtonSubmit("send");
    return (
        <div>
            {error && <div>Oops something happened!</div>}
            <button onClick={submit}>Make Friend Request</button>
        </div>
    );
}

function CancelButton() {
    const [submit, error] = useFriendButtonSubmit("cancel");
    return (
        <div>
            {error && <div>Oops something happened!</div>}
            <button onClick={submit}>Cancel Friend Request</button>
        </div>
    );
}

function AcceptButton() {
    const [submit, error] = useFriendButtonSubmit("accept");
    return (
        <div>
            {error && <div>Oops something happened!</div>}
            <button onClick={submit}>Accept Friend Request</button>
        </div>
    );
}

function EndButton() {
    const [submit, error] = useFriendButtonSubmit("end");
    return (
        <div>
            {error && <div>Oops something happened!</div>}
            <button onClick={submit}>End Friendship</button>
        </div>
    );
}

function useFriendButtonSubmit(action) {
    const id = useSelector(state => state.otherUser.id);
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    function submit() {
        axios
            .post(`/api/user/${id}`, {
                action: action
            })
            .then(({ data }) => {
                console.log(data.friendshipStatus);
                dispatch(setFriendshipStatus(data.friendshipStatus));
            })
            .catch(err => {
                setError(true);
                console.log("Error Message: ", err);
            });
    }
    return [submit, error];
} //closes useFriendButtonSubmit

export default function FriendButton() {
    const id = useSelector(state => state.otherUser.id);
    const friendshipStatus = useSelector(state => state.friendshipStatus);

    console.log(friendshipStatus);
    let button;
    if (!friendshipStatus) {
        button = <SendButton />;
    } else {
        if (friendshipStatus.accepted) {
            button = <EndButton />;
        } else {
            if (friendshipStatus.sender_id == id) {
                button = <AcceptButton />;
            } else {
                button = <CancelButton />;
            }
        }
    }
    return <div>{button}</div>;
} //closes FriendButton
