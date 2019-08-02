// export default function(state = {}, action) {
//     if (action.type == "RETREIVE_FRIENDS") {
//         state = {
//             ...state,
//             friendswannable: action.friendswannable
//         };
//     }
//     if (action.type == "ALREADY_FRIEND" || action.type == "WANT_TO_BE_FRIEND") {
//         state = {
//             ...state,
//             friendswannable: action.friendswannable.map(friendswannable => {
//                 if (friendswannable.id != action.id) {
//                     return friendswannable;
//                 }
//                 return {
//                     ...friendswannable,
//                     isFriend: action.type == "alreadyFriend"
//                 };
//             })
//         };
//     }
//
//     return state;
// }

// const friends = useSelector() //filter out friends
// const wannabes = useSelector()//filter out wannabes

import * as actions from "./actions";

export function fetchUser() {
    return fetch("/user")
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
            return actions.getUser(json);
        })
        .catch(error => actions.getUserError(error));
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const initialState = {
    user: {},
    showBio: true,
    showUploader: false
};
export function reducer(state = initialState, action) {
    if (action.type === "GET_USER") {
        const user = action.user;
        console.log(user);
        return { ...state, user };
    }
    if (action.type === "SHOW_UPLOADER") {
        return { ...state, showUploader: action.visible };
    }
    if (action.type === "SHOW_BIO") {
        return { ...state, showBio: action.visible };
    }
    if (action.type == "RETREIVE_FRIENDS") {
        return { ...state, users: action.users };
    }
    if (action.type == "ALREADY_FRIEND" || action.type == "WANT_FRIEND") {
        return {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    ...user,
                    hot: action.type == "ALREADY_FRIEND"
                };
            })
        };
    }

    return state;
}
