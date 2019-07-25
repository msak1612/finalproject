import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import Welcome from "./welcome";

let elem;

if (location.pathname == "/welcome") {
    //they are logged out
    elem = <Welcome />;
} else {
    //they are logged in
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));
