export function setUser(user) {
    return { type: "SET_USER", user: user };
}

export function setOnlineUsers(users) {
    return { type: "SET_ONLINE_USERS", users: users };
}

export function friendRequestCount(count) {
    return { type: "SET_FRIEND_REQUEST_COUNT", count: count };
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

export function saveProfilePic(file) {
    return { type: "SAVE_PROFILE_PIC", pic: file };
}

export function setOtherUser(user) {
    return { type: "SET_OTHER_USER", user: user };
}

export function setPosts(posts) {
    return { type: "SET_POSTS", posts: posts };
}

export function setReplies(id, replies) {
    return { type: "SET_REPLY_POSTS", id: id, replies: replies };
}

export function draftPost(post) {
    return { type: "DRAFT_POST", post: post };
}

export function setReplyPost(id) {
    return { type: "REPLY_POST", id: id };
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

export function newChatMessage(msg) {
    return { type: "NEW_CHAT_MESSAGE", message: msg };
}

export function chatMessages(msgs) {
    return { type: "CHAT_MESSAGES", messages: msgs };
}

export function setChallenges(challenges) {
    return { type: "SET_CHALLENGES", challenges: challenges };
}

export function setLevel(level) {
    return { type: "SET_LEVEL", level: level };
}

export function setChallenge(challenge) {
    return { type: "SET_CHALLENGE", challenge: challenge };
}

export function setSolution(solution) {
    return { type: "SET_SOLUTION", solution: solution };
}

export function setResult(result) {
    return { type: "SET_RESULT", result: result };
}
