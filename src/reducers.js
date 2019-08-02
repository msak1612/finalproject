import "./actions";

const initialState = {
    user: {},
    otherUser: {},
    friendshipStatus: {},
    showBio: true,
    draftBio: "",
    showUploader: false,
    fileToUpload: ""
};

export function reducer(state = initialState, action) {
    if (action.type === "SET_USER") {
        const user = action.user;
        return { ...state, user };
    }
    if (action.type === "SET_OTHER_USER") {
        return { ...state, otherUser: action.user };
    }
    if (action.type === "SET_FRIENDSHIP_STATUS") {
        return { ...state, friendshipStatus: action.status };
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
    if (action.type == "RETREIVE_FRIENDS") {
        return { ...state, user: action.user };
    }
    // if (action.type == "ALREADY_FRIEND" || action.type == "WANT_FRIEND") {
    //     return {
    //         ...state,
    //         user: state.user.map(user => {
    //             if (user.id != action.id) {
    //                 return user;
    //             }
    //             return {
    //                 ...user,
    //                 isFriend: action.type == "ALREADY_FRIEND"
    //             };
    //         })
    //     };
    // }

    return state;
}
