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
        state.friends.friends.find(friend => friend.id == id)
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
                    props.history.push("/profile");
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
                <div className="display-colwise" id="other-profile-pic">
                    <User
                        user={otherUser}
                        userstyle="profile"
                        showbio="true"
                        options=<FriendButton id={otherUser.id} />
                    />
                    <div id="suggestion">
                        <UserList
                            className="suggestion"
                            list={otherUser.suggestions}
                            title="Like to see related people"
                        />
                    </div>
                </div>
            )}
            {friend && <Posts id={id} />}
            {!otherUser && <div className="error">User not found!!!</div>}
        </div>
    );
} //closes OtherProfile
