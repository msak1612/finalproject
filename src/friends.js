import React, { useEffect } from "react";
import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "./actions";
import { UserList } from "./user";
import FriendButton from "./friendbutton";

export default function Friends() {
    const dispatch = useDispatch();
    const request_count = useSelector(state => state.friends.request_count);
    const all_friends = useSelector(state => state.friends.friends);
    const friends = useSelector(state =>
        state.friends.friends.filter(friend => friend.accepted == true)
    );
    const wannabes = useSelector(state =>
        state.friends.friends.filter(
            friend => friend.accepted == false && friend.id == friend.sender_id
        )
    );
    const invites = useSelector(state =>
        state.friends.friends.filter(
            friend => friend.accepted == false && friend.id != friend.sender_id
        )
    );
    useEffect(() => {
        axios
            .get("/api/friends")
            .then(({ data }) => {
                dispatch(setFriends(data));
            })
            .catch(err => {
                console.log(err);
            });
    }, [friends.length, wannabes.length, invites.length, request_count]); //closes useEffect

    return (
        <section id="display-colwise">
            <div className="friend-list">
                <UserList
                    list={wannabes}
                    title="These people want to be your friends"
                    options=<FriendButton />
                />
            </div>
            <div className="friend-list">
                <UserList
                    className="friend-list"
                    list={friends}
                    title="These people are currently your friends"
                    options=<FriendButton />
                />
            </div>
            <div className="friend-list">
                <UserList
                    className="friend-list"
                    list={invites}
                    title="Invitation sent but not yet accepted"
                    options=<FriendButton />
                />
            </div>
            {all_friends.length == 0 && (
                <h3>No friends yet... Come back later..</h3>
            )}
        </section>
    );
} //closes Friends
