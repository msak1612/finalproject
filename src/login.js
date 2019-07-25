import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    } //closes constructor

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    } //closes handleChange

    handleLoginClick(event) {
        event.preventDefault();
        axios
            .post("/login", {
                login: this.state.email,
                pwd: btoa(this.state.pwd)
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    } //closes handleClick

    render() {
        return (
            <div>
                {this.state.error && (
                    <div className="error">
                        Something went wrong. Please try again!
                    </div>
                )}

                <input
                    name="email"
                    type="email"
                    placeholder="Login name"
                    onChange={e => this.handleChange(e)}
                    required
                />
                <input
                    name="pwd"
                    type="password"
                    placeholder="password"
                    onChange={e => this.handleChange(e)}
                    required
                />

                <button onClick={e => this.handleLoginClick(e)}>Login</button>
            </div>
        );
    } //closes render
} //closes Login

/********* Async function *********/
// function makePasta() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("Pasta done.");
//             resolve();
//         }, 1500);
//     });
// }
//
// function makeSauce() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("Pasta done.");
//             resolve();
//         }, 1500);
//     });
// }
//
// function grateCheese() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("Pasta done.");
//             resolve();
//         }, 1500);
//     });
// }
//
// // makePasta()
// //     .then(() => {
// //         makeSauce().then(() => {
// //             grateCheese().then(() => {
// //                 console.log("ALL DONE!");
// //             });
// //         });
// //     })
// //     .catch(err => {
// //         console.log(err);
// //     });
// //This is equivalent as above
// async function makeDinner() {
//     try {
//         const pastaPromise = makePasta();
//
//         const saucePromise = makeSauce();
//         const cheesePromise = grateCheese();
//         console.log(pastaPromise, saucePromise, cheesePromise);
//         return {
//             pasta: await pastaPromise,
//             sauce: await saucePromise,
//             cheese: await cheesePromise
//         };
//     } catch (err) {
//         console.log(err);
//     }
// }
// makeDinner().then(() => {
//     console.log("DONE!");
// });
