import React from "react";
import axios from "axios";

//one component per file - always export default,
//Registration is class component - needs state
export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // componentDidMount() {
    //     axios.get("/register").then(response => {
    //         this.setState({
    //             first: response.data.first,
    //             last: response.data.last,
    //             email: response.data.email,
    //             pwd: response.data.pwd
    //         });
    //     });
    // }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleClick(event) {
        event.preventDefault();
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                pwd: this.state.pwd,
                pwd1: this.state.pwd1
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
    }
    //single page - logged in & Registration - single page.. switch between these components.
    //add this in index.js

    render() {
        return (
            <div>
                {this.state.error && <div className="error">Oops!</div>}
                <input name="first" type="text" onChange={this.handleChange} />
                <input name="last" type="text" onChange={this.handleChange} />
                <input name="email" type="email" onChange={this.handleChange} />
                <input
                    name="pwd"
                    type="password"
                    onChange={this.handleChange}
                />
                <input
                    name="pwd1"
                    type="password"
                    onChange={this.handleChange}
                />
                <button onClick={this.handleClick}>Register</button>
            </div>
        );
    }
}

//<button onClick={e => this.submit(e)}>Register</button>
//style={{color: 'tomato'}}
