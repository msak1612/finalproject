import React from "react";

export default function ProfilePic({ image, first, last, onClick }) {
    image = image || "/images/default.png";
    return (
        <img
            id="profile-pic"
            src={image}
            alt={`${first} ${last}`}
            onClick={onClick}
        />
    );
}

//size
//width
