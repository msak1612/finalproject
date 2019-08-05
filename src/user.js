import React from "react";
import { Link } from "react-router-dom";

export function User(props) {
    const user = props.user;
    return (
        <div className={props.mini == "true" ? "mini-profile" : "profile"}>
            <img
                src={user.profile_pic}
                className={props.mini == "true" ? "mini-pic" : "profile-pic"}
            />
            <div className="profile-info">
                {props.mini ? (
                    <Link to={"/user/" + user.id} className="profile-name">
                        {props.user.first_name} &nbsp;
                        {props.user.last_name}
                    </Link>
                ) : (
                    <span className="profile-name">
                        {user.first_name}&nbsp;{user.last_name}
                    </span>
                )}
                <span>{user.bio}</span>
                {props.options && (
                    <props.options.type {...props.options.props} id={user.id} />
                )}
            </div>
        </div>
    );
}

export function UserList(props) {
    if (!props.list || props.list.length == 0) {
        return null;
    }

    return (
        <div className="userlist">
            {props.title && <h4>{props.title}</h4>}
            <div className={`${props.liststyle}`}>
                {props.list.map(user => (
                    <User
                        key={user.id}
                        user={user}
                        options={props.options}
                        mini="true"
                    />
                ))}
            </div>
        </div>
    );
}
