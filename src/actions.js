export function getUser(user) {
    return { type: "GET_USER", user: user };
}

export function getUserError(error) {
    return { type: "GET_USER_ERROR", error: error };
}

export function showBio() {
    return { type: "SHOW_BIO", visible: true };
}

export function updateBio(bio) {
    return { type: "UPDATE_BIO", bio: bio };
}

export function showUploader() {
    return { type: "SHOW_UPLOADER", visible: true };
}
