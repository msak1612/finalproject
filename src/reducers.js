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
    return { ...state, friends: action.friends };
}

function onSetFriendRequestCount(state, action) {
    return { ...state, request_count: action.count };
}

function onAcceptFriend(state, action) {
    let newFriends = state.friends;
    let index = newFriends.findIndex(item => item.id == action.id);
    newFriends[index].accepted = true;
    return { ...state, friends: newFriends };
}

function onEndFriendship(state, action) {
    let newFriends = state.friends.filter(friend => friend.id != action.id);
    return { ...state, friends: newFriends };
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

function onSetPosts(state, action) {
    return { ...state, posts: action.posts };
}

function onSetReplies(state, action) {
    let newPosts = state.posts;
    let index = newPosts.findIndex(item => item.id == action.id);
    newPosts[index].replies = action.replies;
    return { ...state, posts: newPosts };
}

function onDraftPost(state, action) {
    return { ...state, draftPost: action.post };
}

function onReplyPost(state, action) {
    return { ...state, replyPost: action.id };
}

function onSetChat(state, action) {
    const newMsgs = state;
    newMsgs.append(action.message);
    if (newMsgs.length > 10) {
        newMsgs.unshift();
    }
    return newMsgs;
}

function onGetChats(state, action) {
    return action.messages;
}

function onSetOnlineUsers(state, action) {
    return action.users;
}

function onSetChallenges(state, action) {
    return { ...state, challenges: action.challenges };
}

function onSetChallenge(state, action) {
    return {
        ...state,
        challenge: action.challenge
    };
}

function onSetSolution(state, action) {
    let challenge = state.challenge;
    challenge.solution = action.solution;
    return { ...state, challenge: challenge };
}

function onSetResult(state, action) {
    let challenge = state.challenge;
    challenge.result = action.result;
    return { ...state, challenge: challenge };
}

function onSetLevel(state, action) {
    return { ...state, level: action.level, tag: "" };
}

function onSetTag(state, action) {
    return { ...state, tag: action.tag, level: -1 };
}

const friendsReducer = createReducer(
    { friends: [], request_count: 0 },
    {
        SET_FRIENDS: onSetFriends,
        ACCEPT_FRIEND: onAcceptFriend,
        END_FRIENDSHIP: onEndFriendship,
        CANCEL_FRIENDSHIP: onEndFriendship,
        SET_FRIEND_REQUEST_COUNT: onSetFriendRequestCount
    }
);

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

const postReducer = createReducer(
    { posts: [], draftPost: "", replyPost: 0 },
    {
        SET_POSTS: onSetPosts,
        SET_REPLY_POSTS: onSetReplies,
        DRAFT_POST: onDraftPost,
        REPLY_POST: onReplyPost
    }
);

const chatReducer = createReducer([], {
    NEW_CHAT_MESSAGE: onSetChat,
    CHAT_MESSAGES: onGetChats
});

const onlineUsersReducer = createReducer(
    {},
    {
        SET_ONLINE_USERS: onSetOnlineUsers
    }
);

const challengeReducer = createReducer(
    {
        challenges: [],
        level: -1,
        tag: "",
        challenge: {
            description: "",
            solution: ""
        }
    },
    {
        SET_CHALLENGES: onSetChallenges,
        SET_LEVEL: onSetLevel,
        SET_TAG: onSetTag,
        SET_CHALLENGE: onSetChallenge,
        SET_SOLUTION: onSetSolution,
        SET_RESULT: onSetResult
    }
);

export const reducer = combineReducers({
    friends: friendsReducer,
    edit: editReducer,
    user: userReducer,
    posts: postReducer,
    otherUser: otherUserReducer,
    chat: chatReducer,
    onlineUsers: onlineUsersReducer,
    challenges: challengeReducer
});
