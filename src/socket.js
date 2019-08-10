import * as io from "socket.io-client";
import store from "./start";
import {
    chatMessages,
    newChatMessage,
    setOnlineUsers,
    friendRequestCount
} from "./actions";
// onlineUsers, userJoined, userLeft, newChatMsg,

export let socket;

export const init = () => {
    if (!socket) {
        socket = io.connect();
        socket.on("onlineusers", users => {
            let id = store.getState().user.id;
            const result = users.filter(user => user.id != id);
            store.dispatch(setOnlineUsers(result));
        });

        socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
        socket.on("friendrequest", request_count => {
            console.log(request_count);
            store.dispatch(friendRequestCount(request_count.count));
        });
        socket.on("newMessage", msg => store.dispatch(newChatMessage(msg)));
    }
};
