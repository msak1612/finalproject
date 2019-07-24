// src/App.js
import React from "react";
import axios from "./axios";

// let elem;
//
// if (location.pathname == "/welcome") {
//     //they are logged out
//     elem = <Login />;
// } else {
//     //they are logged in
// }

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoggedIn: false };
    }

    // componentDidMount is the React version of "mounted"
    componentDidMount() {
        axios.get("/get-animal").then(resp => {
            this.setState({
                name: resp.data.name,
                cutenessScore: resp.data.cutenessScore
            });
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick(e) {
        e.preventDefault();
        console.log("this.state: ", this.state);
        // from here you could make a POST request with
        // axios... just like we did with Vue!
    }

    render() {
        return (
            <div>
                <AnimalsContainer
                    name={this.state.name}
                    cutenessScore={this.state.cutenessScore}
                />
                <HelloWorld />
                <form>
                    <input
                        type="text"
                        name="name"
                        onChange={this.handleChange}
                    />
                    <input
                        type="text"
                        name="cutenessScore"
                        onChange={this.handleChange}
                    />
                    <button onClick={this.handleClick}>submit</button>
                </form>
            </div>
        );
    }
}
