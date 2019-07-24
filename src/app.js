// src/App.js
import React from "react";
import HelloWorld from "./start";
import axios from "axios";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "",
            cutenessScore: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
