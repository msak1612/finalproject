import "./actions";

const initialState = {
    user: {},
    otherUser: {},
    showBio: true,
    draftBio: "",
    showUploader: false,
    fileToUpload: "",
    friends: []
};

export function reducer(state = initialState, action) {
    if (action.type === "SET_USER") {
        const user = action.user;
        return { ...state, user };
    }
    if (action.type === "SET_OTHER_USER") {
        const user = action.user;
        user.friendship = action.friendship;
        return {
            ...state,
            otherUser: user
        };
    }
    if (action.type === "SET_OTHER_FRIENDSHIP") {
        const otherUser = state.otherUser;
        otherUser.friendship = action.friendship;
        return { ...state, otherUser: otherUser };
    }
    if (action.type === "SHOW_UPLOADER") {
        return { ...state, showUploader: action.visible };
    }
    if (action.type === "SHOW_BIO") {
        return { ...state, showBio: action.visible };
    }
    if (action.type === "SAVE_BIO") {
        let user = state.user;
        user.bio = action.bio;
        return { ...state, user: user, showBio: true };
    }
    if (action.type === "DRAFT_BIO") {
        return { ...state, draftBio: action.bio };
    }
    if (action.type === "FILE_TO_UPLOAD") {
        return { ...state, fileToUpload: action.file };
    }
    if (action.type === "SAVE_PROFILE_PIC") {
        let user = state.user;
        user.profile_pic = action.pic;
        return { ...state, user: user, showUploader: false };
    }

    if (action.type == "SET_FRIENDS") {
        return { ...state, friends: action.friends };
    }

    if (action.type == "ACCEPT_FRIEND") {
        const friends = state.friends;
        let index = friends.findIndex(friend => friend.id == action.id);
        friends[index].accepted = true;
        return { ...state, friends: friends };
    }

    if (action.type == "END_FRIENDSHIP") {
        const result = state.friends.filter(friend => friend.id != action.id);
        return { ...state, friends: result };
    }

    return state;
}
