import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chatroom() {
    const chatMessages = useSelector(state => state && state.chat);
    const onlineUsers = useSelector(state => state && state.onlineUsers);

    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="chat-users-container">
            <section className="chat-container">
                <div id="chat-box" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map(message => (
                            <div id="msg" key={message.id}>
                                <div id="pic-name">
                                    <img
                                        id="chat-pic"
                                        src={
                                            message.profile_pic
                                                ? message.profile_pic
                                                : "/images/default.png"
                                        }
                                        alt={`${message.first_name} ${message.last_name}`}
                                    />
                                    <h4 id="chat-text">
                                        &nbsp;{message.first_name}&nbsp;
                                        {message.last_name}
                                    </h4>
                                </div>
                                <div>
                                    <p>{message.message}</p>
                                    <p id="time">{message.created_at}</p>
                                </div>
                            </div>
                        ))}
                </div>
                <textarea
                    placeholder="Add yout chat message here."
                    onKeyDown={keyCheck}
                ></textarea>
            </section>
            <div className="display-colwise online-container">
                <h4>Online Users</h4>
                {onlineUsers.length > 0 &&
                    onlineUsers.map(user => (
                        <div key={user.id} className="online-user">
                            <img
                                src={
                                    user.profile_pic
                                        ? user.profile_pic
                                        : "/images/default.png"
                                }
                                className="online-user-pic"
                            />
                            <div className="online-user-name">
                                <span>
                                    &nbsp;{user.first_name}&nbsp;
                                    {user.last_name}
                                </span>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
} //closes Chatroom
