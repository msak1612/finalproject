import React, { useEffect } from "react";
import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import /*3 action creators*/ "./reducers";

export default function Friends() {
    const dispatch = useDispatch();

    const friends = useSelector(state => state.friends);
    const wannabes = useSelector(state => state.wannabes);

    useEffect(() => {
        let button;
        //when the function component mounts (use useEffect to know this),
        //it should dispatch the action for getting the array of friends and wannabes
        if (friends) {
            button = (
                <button
                    onClick={() =>
                        dispatch({ type: "ALREADY_FRIEND", visible: false })
                    }
                >
                    End Friendship
                </button>
            );
        } else {
            button = (
                <button
                    onClick={() =>
                        dispatch({ type: "ALREADY_FRIEND", visible: false })
                    }
                >
                    Accept Friend Request
                </button>
            );
        }
    }); //closes useEffect
    return (
        <section>
            <div>
                <h4>These people want to be your friends</h4>
            </div>
            <div>
                <h4>These people are currently your friends</h4>
            </div>
        </section>
    );
} //closes Friends
