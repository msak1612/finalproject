import * as io from "socket.io-client";

const socket = io.connect();

socket.on("welcome", function() {
    "greeting";
    payload => {
        console.log(payload);
        socket.emit("niceToBeHere", {
            chicken: "funky"
        });
    };
});

socket.on("newPlayer", () => console.log("NEW PLAYER"));
