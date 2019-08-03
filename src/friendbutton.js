import React, { useState, useEffect } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { setFriendship } from "./actions";

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
                dispatch(setFriendship(data.friendshipStatus));
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
    const friendship = useSelector(state => state.otherUser.friendship);

    let button;
    if (!friendship) {
        button = <SendButton />;
    } else {
        if (friendship.accepted) {
            button = <EndButton />;
        } else {
            if (friendship.sender_id == id) {
                button = <AcceptButton />;
            } else {
                button = <CancelButton />;
            }
        }
    }
    return <div>{button}</div>;
} //closes FriendButton
