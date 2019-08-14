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

function onDeletePost(state, action) {
    return { ...state, deletePost: action.id };
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

function onSetSideBarVisibility(state, action) {
    let sideBar = state;
    state.visible = action.visible;
    return sideBar;
}

function onAddNotification(state, action) {
    let notifications = state.notifications;
    notifications.push(action.notification);
    return { ...state, notifications: notifications, show: false };
}

function onShowNotification(state, action) {
    return { ...state, show: true };
}

function onClearNotifications(state, action) {
    return { ...state, notifications: [], show: false };
}

function onSetChallenges(state, action) {
    return { ...state, challenges: action.challenges };
}

function onSetClassifiers(state, action) {
    return { ...state, classifiers: action.classifiers };
}

function onSetCollections(state, action) {
    let collections = action.collections;
    collections.forEach(function(collection) {
        collection.challenges = collection.challenges.filter(
            value => Object.keys(value).length !== 0
        );
    });
    let collection = state.collection;
    collection.editedChallenge = -1;
    collection.editedCollection = -1;
    return { ...state, collections: collections, collection: collection };
}

function onAddCollection(state, action) {
    let collection = state.collection;
    collection.editedCollection = action.collection;
    collection.editedChallenge = -1;
    return { ...state, collection: collection };
}

function onAddChallenge(state, action) {
    let collection = state.collection;
    collection.editedChallenge = action.challenge;
    collection.editedCollection = -1;
    return { ...state, collection: collection };
}

function onRemoveCollection(state, action) {
    let collection = state.collection;
    collection.editedCollection = action.collection;
    collection.editedChallenge = -1;
    return { ...state, collection: collection };
}

function onRemoveChallenge(state, action) {
    let collection = state.collection;
    collection.editedCollection = action.collection;
    collection.editedChallenge = action.challenge;
    return { ...state, collection: collection };
}

function onDraftCollectionName(state, action) {
    let collection = state.collection;
    collection.draftName = action.name;
    return { ...state, collection: collection };
}

function onDraftCollectionDescription(state, action) {
    let collection = state.collection;
    collection.draftDescription = action.description;
    return { ...state, collection: collection };
}

function onSetChallenge(state, action) {
    return {
        ...state,
        challenge: action.challenge
    };
}

function onResetChallenge(state, action) {
    let challenge = state.challenge;
    challenge.draftSolution = challenge.template;
    return {
        ...state,
        challenge: challenge
    };
}

function onSetDraftSolution(state, action) {
    let challenge = state.challenge;
    challenge.draftSolution = action.solution;
    return { ...state, challenge: challenge };
}

function onUnlockSolution(state, action) {
    let challenge = state.challenge;
    challenge.unlocked = true;
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

function onSetCompletedSolutions(state, action) {
    return { ...state, solutions: action.solutions };
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
    { posts: [], draftPost: "", replyPost: 0, deletePost: 0 },
    {
        SET_POSTS: onSetPosts,
        SET_REPLY_POSTS: onSetReplies,
        DRAFT_POST: onDraftPost,
        REPLY_POST: onReplyPost,
        DELETE_POST: onDeletePost
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
        classifiers: { levels: [], tags: [] },
        collections: [],
        collection: {
            editedCollection: -1,
            editedChallenge: -1,
            draftName: "",
            draftDescription: ""
        },
        level: -1,
        tag: "",
        challenge: {
            description: "",
            draftSolution: "",
            template: ""
        },
        solutions: []
    },
    {
        SET_CHALLENGES: onSetChallenges,
        SET_CLASSIFIERS: onSetClassifiers,
        SET_LEVEL: onSetLevel,
        SET_TAG: onSetTag,
        SET_CHALLENGE: onSetChallenge,
        SET_DRAFT_SOLUTION: onSetDraftSolution,
        UNLOCK_SOLUTION: onUnlockSolution,
        SET_RESULT: onSetResult,
        RESET_CHALLENGE: onResetChallenge,
        SET_COLLECTIONS: onSetCollections,
        ADD_COLLECTION: onAddCollection,
        ADD_CHALLENGE: onAddChallenge,
        REMOVE_CHALLENGE: onRemoveChallenge,
        REMOVE_COLLECTION: onRemoveCollection,
        DRAFT_COLLECTION_NAME: onDraftCollectionName,
        DRAFT_COLLECTION_DESCRIPTION: onDraftCollectionDescription,
        SET_COMPLETED_SOLUTIONS: onSetCompletedSolutions
    }
);

const sideBarVisibilityReducer = createReducer(
    { visible: false },
    {
        SET_SIDEBAR_VISIBLE: onSetSideBarVisibility
    }
);

const notificationReducer = createReducer(
    { notifications: [], show: false },
    {
        ADD_NOTIFICATION: onAddNotification,
        CLEAR_NOTIFICATIONS: onClearNotifications,
        SHOW_NOTIFICATION: onShowNotification
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
    challenges: challengeReducer,
    sideBar: sideBarVisibilityReducer,
    notifications: notificationReducer
});
