import React, { useEffect } from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUser, setFriends } from "./actions";
import { User, UserList } from "./user";
import { Posts } from "./posts";

export default function OtherProfile(props) {
    const id = props.match.params.id;
    const dispatch = useDispatch();
    const otherUser = useSelector(state => state.otherUser);
    const friendship = useSelector(state =>
        state.friends.find(friend => friend.id == id)
    );
    var friend = false;
    const url = "/api/user/" + id;

    if (friendship && friendship.accepted) {
        friend = true;
    }
    useEffect(() => {
        axios
            .get(url)
            .then(({ data }) => {
                if (data.sameUser) {
                    props.history.push("/");
                }
                dispatch(setOtherUser(data.user));
                let friends = [];
                if (data.friendshipStatus) {
                    friends = data.friendshipStatus;
                }

                dispatch(setFriends(friends));
            })
            .catch(err => {
                console.log(err);
            });
    }, [url]); //closes useEffect

    return (
        <div className="display-rowwise">
            {otherUser && (
                <div className="display-colwise">
                    <User
                        user={otherUser}
                        userstyle="profile"
                        mini={friend ? "true" : "false"}
                        options=<FriendButton id={otherUser.id} />
                    />
                    <UserList
                        list={otherUser.suggestions}
                        title="Like to see related people"
                    />
                </div>
            )}
            {friend && <Posts id={id} />}
            {!otherUser && <div className="error">User not found!!!</div>}
        </div>
    );
} //closes OtherProfile
