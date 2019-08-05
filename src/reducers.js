import "./actions";
import { combineReducers } from "redux";

function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    };
}

function onSetFriends(state, action) {
    return action.friends;
}

function onAcceptFriend(state, action) {
    let newFriends = state;
    let index = newFriends.findIndex(item => item.id == action.id);
    newFriends[index].accepted = true;
    return newFriends;
}

function onEndFriendship(state, action) {
    return state.filter(friend => friend.id != action.id);
}

function onShowUploader(state, action) {
    let showBio = state.showBio;
    if (!showBio && action.visible) {
        showBio = true;
    }
    return { ...state, showUploader: action.visible, showBio: showBio };
}

function onShowBio(state, action) {
    let showUploader = state.showUploader;
    if (showUploader && !action.visible) {
        showUploader = false;
    }
    return { ...state, showBio: action.visible, showUploader: showUploader };
}

function onDraftBio(state, action) {
    return { ...state, draftBio: action.bio };
}

function onFileToUpload(state, action) {
    return { ...state, fileToUpload: action.file };
}

function onSetUser(state, action) {
    return action.user;
}

function onSaveBio(state, action) {
    return { ...state, bio: action.bio };
}

function onSaveProfilePic(state, action) {
    return { ...state, profile_pic: action.pic };
}

function onSetOtherUser(state, action) {
    return action.user;
}

const friendsReducer = createReducer([], {
    SET_FRIENDS: onSetFriends,
    ACCEPT_FRIEND: onAcceptFriend,
    END_FRIENDSHIP: onEndFriendship,
    CANCEL_FRIENDSHIP: onEndFriendship
});

const initialEditState = {
    showUploader: false,
    showBio: true,
    draftBio: "",
    fileToUpload: ""
};

const editReducer = createReducer(initialEditState, {
    SHOW_UPLOADER: onShowUploader,
    SHOW_BIO: onShowBio,
    DRAFT_BIO: onDraftBio,
    FILE_TO_UPLOAD: onFileToUpload
});

const userReducer = createReducer(
    {},
    {
        SET_USER: onSetUser,
        SAVE_BIO: onSaveBio,
        SAVE_PROFILE_PIC: onSaveProfilePic
    }
);

const otherUserReducer = createReducer(
    {},
    {
        SET_OTHER_USER: onSetOtherUser
    }
);

export const reducer = combineReducers({
    friends: friendsReducer,
    edit: editReducer,
    user: userReducer,
    otherUser: otherUserReducer
});
