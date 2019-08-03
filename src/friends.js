import React, { useEffect } from "react";
import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import { setFriends, acceptFriend, endFriendship } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(state =>
        state.friends.filter(friend => friend.accepted == true)
    );
    const wannabes = useSelector(state =>
        state.friends.filter(friend => friend.accepted == false)
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
    }, [friends.length, wannabes.length]); //closes useEffect

    function accept(e) {
        let id = e.target.getAttribute("id");
        axios
            .post(`/api/user/${id}`, {
                action: "accept"
            })
            .then(() => {
                dispatch(acceptFriend(id));
            })
            .catch(err => {
                console.log("Error Message: ", err);
            });
    }

    function end(e) {
        let id = e.target.getAttribute("id");
        axios
            .post(`/api/user/${id}`, {
                action: "end"
            })
            .then(() => {
                dispatch(endFriendship(id));
            })
            .catch(err => {
                console.log("Error Message: ", err);
            });
    }
    return (
        <section>
            <div>
                {wannabes.length != 0 && (
                    <h4>These people want to be your friends</h4>
                )}
                {wannabes.length != 0 &&
                    wannabes.map(wannabe => (
                        <div key={wannabe.id}>
                            <img
                                src={wannabe.profile_pic}
                                style={{
                                    width: "10vh",
                                    height: "10vh",
                                    margin: "0px 5px 5px",
                                    verticalAlign: "middle"
                                }}
                            />
                            <span>
                                <a href={"/user/" + wannabe.id}>
                                    {wannabe.first_name} {wannabe.last_name}
                                </a>
                            </span>
                            <div>
                                <button
                                    id={wannabe.id}
                                    onClick={e => accept(e)}
                                >
                                    Accept Friend Request
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
            <div>
                {friends.length != 0 && (
                    <h4>These people are currently your friends</h4>
                )}
                {friends.length != 0 &&
                    friends.map(friend => (
                        <div key={friend.id}>
                            <img
                                src={friend.profile_pic}
                                style={{
                                    width: "10vh",
                                    height: "10vh",
                                    margin: "0px 5px 5px",
                                    verticalAlign: "middle"
                                }}
                            />
                            <span>
                                <a href={"/user/" + friend.id}>
                                    {friend.first_name} {friend.last_name}
                                </a>
                            </span>
                            <div>
                                <button id={friend.id} onClick={e => end(e)}>
                                    End Friendship
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
} //closes Friends
