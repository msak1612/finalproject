import React from "react";
import { Link } from "react-router-dom";

export function User(props) {
    const user = props.user;
    return (
        <div className={props.mini == "true" ? "mini-profile" : "profile"}>
            <img
                src={
                    user.profile_pic ? user.profile_pic : "/images/default.png"
                }
                className={props.mini == "true" ? "mini-pic" : "other-pic"}
            />
            <div
                className={
                    props.mini == "true"
                        ? "mini-profile-info"
                        : "other-profile-info"
                }
            >
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
                {props.showbio && <span>{user.bio}</span>}
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
            <div className="display-rowwise">
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
