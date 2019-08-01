import React, { useState, useEffect } from "react";
import axios from "./axios";

function SendButton(props) {
    const [submit, error] = useFriendButtonSubmit(props, "send");
    return (
        <div>
            {error && <div>Oops something happened!</div>}
            <button onClick={submit}>Make Friend Request</button>
        </div>
    );
}

function CancelButton(props) {
    const [submit, error] = useFriendButtonSubmit(props, "cancel");
    return (
        <div>
            {error && <div>Oops something happened!</div>}
            <button onClick={submit}>Cancel Friend Request</button>
        </div>
    );
}

function AcceptButton(props) {
    const [submit, error] = useFriendButtonSubmit(props, "accept");
    return (
        <div>
            {error && <div>Oops something happened!</div>}
            <button onClick={submit}>Accept Friend Request</button>
        </div>
    );
}

function EndButton(props) {
    const [submit, error] = useFriendButtonSubmit(props, "end");
    return (
        <div>
            {error && <div>Oops something happened!</div>}
            <button onClick={submit}>End Friendship</button>
        </div>
    );
}

function useFriendButtonSubmit(props, action) {
    const [error, setError] = useState(false);
    function submit() {
        axios
            .post(`/api/user/${props.id}`, {
                action: action
            })
            .then(({ data }) => {
                props.callback(data.friendshipStatus);
            })
            .catch(err => {
                setError(true);
                console.log("Error Message: ", err);
            });
    }
    return [submit, error];
} //closes useFriendButtonSubmit

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friendshipStatus: this.props.friendshipStatus,
            id: this.props.id
        };
    } //closes constructor

    render() {
        let button;
        console.log(this.props.id);
        if (!this.state.friendshipStatus) {
            button = (
                <SendButton
                    id={this.state.id}
                    callback={e => this.setState({ friendshipStatus: e })}
                />
            );
        } else {
            if (this.state.friendshipStatus.accepted) {
                button = (
                    <EndButton
                        id={this.state.id}
                        callback={e => this.setState({ friendshipStatus: e })}
                    />
                );
            } else {
                if (this.state.friendshipStatus.sender_id == this.state.id) {
                    button = (
                        <AcceptButton
                            id={this.state.id}
                            callback={e =>
                                this.setState({ friendshipStatus: e })
                            }
                        />
                    );
                } else {
                    button = (
                        <CancelButton
                            id={this.state.id}
                            callback={e =>
                                this.setState({ friendshipStatus: e })
                            }
                        />
                    );
                }
            }
        }
        return <div>{button}</div>;
    } //closes render
} //closes FriendButton
