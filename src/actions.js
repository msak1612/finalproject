export function setUser(user) {
    return { type: "SET_USER", user: user };
}

export function showBio(visible) {
    return { type: "SHOW_BIO", visible: visible };
}

export function saveBio(bio) {
    return { type: "SAVE_BIO", bio: bio };
}

export function draftBio(bio) {
    return { type: "DRAFT_BIO", bio: bio };
}

export function showUploader(visible) {
    return { type: "SHOW_UPLOADER", visible: visible };
}

export function fileToUpload(file) {
    return { type: "FILE_TO_UPLOAD", file: file };
}

export function setOtherUser(user) {
    return { type: "SET_OTHER_USER", user: user };
}

export function setFriends(friends) {
    return { type: "SET_FRIENDS", friends: friends };
}

export function acceptFriend(id) {
    return { type: "ACCEPT_FRIEND", id: id };
}

export function endFriendship(id) {
    return { type: "END_FRIENDSHIP", id: id };
}

export function cancelFriendship(id) {
    return { type: "CANCEL_FRIENDSHIP", id: id };
}
