import React from "react";

export default function ProfilePic({ image, first, last, onClick }) {
    image = image || "/images/default.png";
    return <img src={image} alt={`${first} ${last}`} onClick={onClick} />;
}
