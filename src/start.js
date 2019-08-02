import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { reducer, fetchUser } from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";

import App from "./app";
import Welcome from "./welcome";

let elem;

if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    const store = createStore(
        reducer,
        composeWithDevTools(applyMiddleware(reduxPromise))
    );

    store.dispatch(fetchUser());

    elem = (
        <Provider store={store}>
            <App />;
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
