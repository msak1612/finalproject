import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome";
import Registration from "./registration";

let elem;

if (location.pathname == "/welcome") {
    //they are logged out
    elem = <Welcome />;
} else {
    //they are logged in
    elem = <img src="/logo.png" />;
}

ReactDOM.render(elem, document.querySelector("main"));
