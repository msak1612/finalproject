import * as io from "socket.io-client";
import store from "./start";
import {
    chatMessages,
    newChatMessage,
    setOnlineUsers,
    friendRequestCount,
    addNotification,
    clearNotifications
} from "./actions";
// onlineUsers, userJoined, userLeft, newChatMsg,

export let socket;

export const init = () => {
    if (!socket) {
        socket = io.connect();
        socket.on("onlineUsers", users => {
            let id = store.getState().user.id;
            const result = users.filter(user => user.id != id);
            store.dispatch(setOnlineUsers(result));
        });

        socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
        socket.on("friendRequest", request_count => {
            if (request_count.count > 0) {
                store.dispatch(
                    addNotification(
                        "You received " +
                            request_count.count +
                            " friend request"
                    )
                );
            } else {
                store.dispatch(store.dispatch(clearNotifications()));
            }
            store.dispatch(friendRequestCount(request_count.count));
        });
        socket.on("newMessage", msg => store.dispatch(newChatMessage(msg)));
        socket.on("gainedScore", msg => {
            store.dispatch(addNotification("You Scored " + msg));
        });
    }
};
